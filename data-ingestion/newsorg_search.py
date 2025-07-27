import os
import time
import random
import json
import requests
from dotenv import load_dotenv
from google.cloud import pubsub_v1

# Load environment variables
load_dotenv()
API_KEY = os.getenv("NEWSORG_API_KEY")

# GCP Pub/Sub config
project_id = "primal-outrider--q3"
topic_id = "raw-newsorg-pub"
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

# NewsAPI endpoint
BASE_URL = "https://newsapi.org/v2/everything"

# Hot keywords (30 total)
KEYWORDS = [
    "stock", "bitcoin", "ai", "elon-musk", "election", "war", "inflation", "startup", "climate","nasa", "crypto", "meta", "apple", "tesla", "openai", "cybersecurity", "global economy",
    "vaccination", "sports", "technology", "5G", "recession", "trump", "google","microsoft", "spaceX","web3", "chatgpt", "ev", "metaverse",
    "social media", "tiktok", "depression", "remote", "layoffs", "funding",
    "biotech","iphone","fed","tsunami","disaster"
]

# Function to publish article to Pub/Sub
def publish_article_to_pubsub(article):
    try:
        data_str = json.dumps(article, default=str)
        data_bytes = data_str.encode("utf-8")
        future = publisher.publish(topic_path, data_bytes)
        print(f"📤 Published message ID: {future.result()}")
    except Exception as e:
        print(f"❌ Error publishing to Pub/Sub: {e}")

# Begin 50 requests
for i in range(50): #50
    keyword = random.choice(KEYWORDS)

    params = {
        "q": keyword,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize":25,
        "apiKey": API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        articles = data.get("articles", [])

        print(f"[{i+1}/25] ✅ Keyword: {keyword} | Articles: {len(articles)}")

        for article in articles:
            # Add keyword as context tag
            article["keyword_used"] = keyword
            publish_article_to_pubsub(article)

    except requests.RequestException as e:
        print(f"[{i+1}/25] ❌ Request error: {e}")

    # Wait 5 seconds before next request
    if i != 49:
        time.sleep(5)

print("\n✅ Completed 50 NewsAPI requests and published articles to Pub/Sub.")

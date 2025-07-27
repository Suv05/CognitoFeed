import os
import random
import time
import json
import requests
from dotenv import load_dotenv
from google.cloud import pubsub_v1

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("GNEWS_API_KEY")

# GCP Pub/Sub configuration
project_id = "primal-outrider--q3"
topic_id = "raw-gnews-pub"
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

# Endpoint and constants
BASE_URL = "https://gnews.io/api/v4/search"
COUNTRIES = ["in", "ca", "us", "gb", "de", "jp", "ru","cn","au"]

KEYWORDS = [
    "stock", "bitcoin", "ai", "elon-musk", "election", "war", "inflation", "startup", "climate","nasa", "crypto", "meta", "apple", "tesla", "openai", "cybersecurity", "global economy",
    "vaccination", "sports", "technology", "5G", "recession", "trump", "google","microsoft", "spaceX","web3", "chatgpt", "ev", "metaverse",
    "social media", "tiktok", "depression", "remote", "layoffs", "funding",
    "biotech","iphone","fed","tsunami","disaster"
]


# Pub/Sub publishing function
def publish_article_to_pubsub(article):
    try:
        data_json = json.dumps(article, default=str)
        data_bytes = data_json.encode("utf-8")
        future = publisher.publish(topic_path, data_bytes)
        print(f"📤 Published message ID: {future.result()}")
    except Exception as e:
        print(f"❌ Error publishing article: {e}")

# Execute 40 API requests
for i in range(5): #40
    keyword = random.choice(KEYWORDS)
    country = random.choice(COUNTRIES)

    params = {
        "q": keyword,
        "country": country,
        "lang": "en",
        "max": 10,
        "apikey": API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        articles = data.get("articles", [])

        print(f"[{i+1}/40] ✅ Keyword: {keyword} | Country: {country} | Articles: {len(articles)}")

        for article in articles:
            publish_article_to_pubsub(article)

    except requests.RequestException as e:
        print(f"[{i+1}/40] ❌ API error: {e}")

    # Sleep 3 to 4 seconds between requests
    if i != 4: #39
        sleep_duration = random.uniform(3.0, 4.0)
        time.sleep(sleep_duration)

print("\n✅ Completed 40 keyword-based GNews requests and published all articles to Pub/Sub.")

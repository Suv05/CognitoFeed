import os
import random
import time
import json
import requests
from dotenv import load_dotenv
from google.cloud import pubsub_v1

# Load environment variables from .env
load_dotenv()
API_KEY = os.getenv("GNEWS_API_KEY")

# Pub/Sub configuration
project_id = "primal-outrider--q3"
topic_id = "raw-gnews-pub"
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

# Constants
BASE_URL = "https://gnews.io/api/v4/top-headlines"
CATEGORIES = ["general", "world", "nation", "business", "technology", "entertainment", "sports", "science", "health"]
COUNTRIES = ["in", "ca", "us", "gb", "de", "jp", "ru","cn","au"]

# Function to publish to Pub/Sub
def publish_to_pubsub(article):
    try:
        data_str = json.dumps(article, default=str)
        data_bytes = data_str.encode("utf-8")
        future = publisher.publish(topic_path, data_bytes)
        print(f"📤 Published message ID: {future.result()}")
    except Exception as e:
        print(f"❌ Error publishing to Pub/Sub: {e}")

# List to optionally store articles (can be skipped if using only Pub/Sub)
all_articles = []

# Perform 60 requests with 3s delay
for i in range(50): #60
    category = random.choice(CATEGORIES)
    country = random.choice(COUNTRIES)

    params = {
        "category": category,
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
        
        print(f"[{i+1}/60] ✅ Category: {category} | Country: {country} | Articles: {len(articles)}")

        for article in articles:
            publish_to_pubsub(article)
            all_articles.append(article)  # Optional: Save locally

    except requests.RequestException as e:
        print(f"[{i+1}/60] ❌ API request failed: {e}")

    # Wait 3 seconds between requests (respect rate limits)
    if i != 49: #59
        time.sleep(3)

print(f"\n✅ Finished. Total articles published: {len(all_articles)}")

import os
import requests
import random
import time
import json
from dotenv import load_dotenv
from google.cloud import pubsub_v1

# Load environment variables
load_dotenv()
API_KEY = os.getenv("NEWSORG_API_KEY")

# Initialize your credentials and topic
PROJECT_ID = "primal-outrider--q3"
TOPIC_ID = "raw-newsorg-pub"


# Initialize publisher
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

# Define categories and countries
categories = [
    "business", "entertainment", "general", "health", "science", "sports", "technology"
]

countries = ["in", "ca", "us", "gb", "de", "jp", "ru","cn","au"]

# Number of requests
NUM_REQUESTS = 5 #50

# Loop for fetching and publishing
for i in range(NUM_REQUESTS):
    category = random.choice(categories)
    country = random.choice(countries)

    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "category": category,
        "country": country,
        "pageSize": 15,
        "apiKey": API_KEY
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        articles = data.get("articles", [])

        for article in articles:
            # Convert article to JSON string
            message_data = json.dumps(article).encode("utf-8")

            # Publish to Pub/Sub
            future = publisher.publish(topic_path, data=message_data)
            print(f"Published article to {TOPIC_ID}: {article.get('title')}")

    except Exception as e:
        print(f"Error in request {i + 1}: {e}")

    # Sleep for 5 seconds
    time.sleep(5)

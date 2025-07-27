import tweepy
import os
from dotenv import load_dotenv
import random
from google.cloud import pubsub_v1
import json

project_id = "primal-outrider--q3"
topic_id = "raw-news-articles"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

# Load environment variables
load_dotenv()
bearer_token = os.getenv("BEARER_TOKEN5")

# Initialize Tweepy Client
client = tweepy.Client(bearer_token=bearer_token)

def publish_news_article(article_data):
    """
    Publishes an article (dictionary) to the Google Cloud Pub/Sub topic.
    """
    try:
        data_json = json.dumps(article_data, default=str)
        data_bytes = data_json.encode("utf-8")
        future = publisher.publish(topic_path, data_bytes)
        print(f"Published message ID: {future.result()}")
    except Exception as e:
        print(f"Error publishing message: {e}")

def fetch_posts(query, max_results=100):
    try:
        tweets = client.search_recent_tweets(
            query=query,
            max_results=max_results,
            tweet_fields=["created_at", "text", "author_id", "lang"],
            user_fields=["username"],
            expansions=["author_id"]
        )
        
        posts_data = []
        users = {u["id"]: u for u in tweets.includes.get("users", [])}
        
        for tweet in tweets.data:
            post = {
                "text": tweet.text,
                "created_at": tweet.created_at,
                "author": users.get(tweet.author_id, {}).get("username", "Unknown"),
                "language": tweet.lang
            }
            posts_data.append(post)
            publish_news_article(post)
        
        return posts_data
    
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return []

# List of keywords
KEYWORDS = [
    "stock", "bitcoin", "ai", "elon-musk", "election", "war", "inflation", "china", "startup", "climate",
    "nasa", "machine learning", "crypto", "meta", "apple", "tesla", "openai", "cybersecurity", "quantum computing", "global economy",
    "data breach", "vaccination", "sports", "technology", "india", "gpt-5", "privacy", "5G", "banking", "recession"
]

selected_keyword = random.choice(KEYWORDS)
query = f"{selected_keyword} -is:retweet lang:en"

# Just fetch and publish, no printing
fetch_posts(query, max_results=99)

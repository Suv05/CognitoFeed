import tweepy
import os
from dotenv import load_dotenv

from google.cloud import pubsub_v1
import json

project_id = "primal-outrider--q3"
topic_id = "raw-news-articles"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

# Load environment variables
load_dotenv()
bearer_token = os.getenv("BEARER_TOKEN2")

# Initialize Tweepy Client
client = tweepy.Client(bearer_token=bearer_token)

# Define a function to publish news articles to Pub/Sub
def publish_news_article(article_data):
    """
    Publishes an article (dictionary) to the Google Cloud Pub/Sub topic.
    """
    try:
        data_json = json.dumps(article_data, default=str) # default=str to handle datetime objects
        data_bytes = data_json.encode("utf-8") # Pub/Sub messages must be bytes

        future = publisher.publish(topic_path, data_bytes)
        print(f"Published message ID: {future.result()}")
    except Exception as e:
        print(f"Error publishing message: {e}")

# Define a function to fetch posts
def fetch_posts(query, max_results=12):
    try:
        # Search for recent posts
        tweets = client.search_recent_tweets(
            query=query,
            max_results=max_results,
            tweet_fields=["created_at", "text", "author_id", "lang"],
            user_fields=["username"],
            expansions=["author_id"]
        )
        
        # Process and return posts
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
            
            # Publish each post to Pub/Sub
            publish_news_article(post)
        
        return posts_data
    
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return []

# Example: Fetch posts about "Apple stock"
query = "Bitcoin -is:retweet lang:en"  # Exclude retweets, English only
posts = fetch_posts(query, max_results=12)

# Print fetched posts (optional, as they are now also published)
print("\n--- Fetched Posts (also published to Pub/Sub) ---")
for post in posts:
    print(f"Author: {post['author']}, Posted: {post['created_at']}")
    print(f"Text: {post['text']}\n")
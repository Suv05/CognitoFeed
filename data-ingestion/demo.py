twitter_schema = [
    {
        "text": "@VendaVendor @kay_mahapa Wow, @Elizatradepro, I’m speechless! 🙏 I invested R5,000 in Bitcoin, and in just 5 days, it grew to R58,903! That money paid off my overdue bills and let me care for my kids. This was a game-changer for us! 😊",
        "created_at": "2025-07-26 07:54:55+00:00",
        "author": "ArjunRssuresh5",
        "language": "en"
    },
    {
        "text": "@Sikdermahmud79 @FractionAI_xyz “People who laughed at Bitcoin in 2011 are laughing at fractional AI today. \nDon’t be that person. @FractionAI_xyz is where conviction pays. #FutureOfAI”",
        "created_at": "2025-07-26 07:54:55+00:00",
        "author": "YahuzaAmadu",
        "language": "en"
    },
    {
        "text": "@Paullow21 @union_build Union's move to integrate with Bitcoin and become a BSN is an interesting development. Leveraging Bitcoin's security and decentralization could enhance Union's network.",
        "created_at": "2025-07-26 07:54:50+00:00",
        "author": "Man_3hunting",
        "language": "en"
    }
]

from google.cloud import pubsub_v1
import json

project_id = "primal-outrider--q3"
topic_id = "raw-news-articles"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

def publish_news_article(article_data):
    try:
        data_json = json.dumps(article_data, default=str) # default=str to handle datetime objects
        data_bytes = data_json.encode("utf-8") # Pub/Sub messages must be bytes

        future = publisher.publish(topic_path, data_bytes)
        print(f"Published message ID: {future.result()}")
    except Exception as e:
        print(f"Error publishing message: {e}")
        
        
for tweet in twitter_schema:
    publish_news_article(tweet)
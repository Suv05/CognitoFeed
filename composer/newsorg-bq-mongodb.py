from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago
from google.cloud import bigquery
from pymongo import MongoClient
import os
import datetime

# === CONFIGURATION ===
MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set.")


# ---------- CONFIG ----------
BIGQUERY_TABLE = "primal-outrider--q3.newsorg_sentiment.newsorg_data"
MONGO_DB = "cognito_feed"
MONGO_COLLECTION = "newsorg_data"
BATCH_SIZE = 500  # Batch insert size

# ---------- TASK FUNCTION ----------
def bq_to_mongo_newsorg(**context):
    # Initialize BQ client
    bq_client = bigquery.Client()

    # Query all data from the table
    query = f"""
        SELECT * 
        FROM `{BIGQUERY_TABLE}`
    """
    query_job = bq_client.query(query)
    results = query_job.result()

    # Convert to list of dicts
    rows = []
    for row in results:
        row_dict = dict(row)
        # Ensure datetime compatibility for MongoDB
        for key, value in row_dict.items():
            if isinstance(value, datetime.datetime):
                row_dict[key] = value
        rows.append(row_dict)

    # Insert into MongoDB
    mongo_client = MongoClient(MONGODB_URI)
    collection = mongo_client[MONGO_DB][MONGO_COLLECTION]

    # Batch insert to avoid memory issues
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        if batch:
            collection.insert_many(batch)

    mongo_client.close()
    print(f"Inserted {len(rows)} documents into {MONGO_DB}.{MONGO_COLLECTION}")

# ---------- DAG DEFINITION ----------
with DAG(
    dag_id="bq_to_mongo_newsorg_transfer",
    default_args={"owner": "airflow"},
    description="Transfer newsorg BigQuery table data to MongoDB collection",
    schedule_interval=None,  # Change to cron for periodic schedule
    start_date=days_ago(1),
    catchup=False,
    tags=["bigquery", "mongodb", "transfer"],
) as dag:

    transfer_task = PythonOperator(
        task_id="transfer_bq_to_mongo_newsorg",
        python_callable=bq_to_mongo_newsorg,
        provide_context=True,
    )

    transfer_task

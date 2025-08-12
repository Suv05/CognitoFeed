from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago
from google.cloud import bigquery
from pymongo import MongoClient
import os
import datetime

# ---------- CONFIG ----------
# === CONFIGURATION ===
MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set.")


BIGQUERY_TABLE = "primal-outrider--q3.gnews_sentiment.gnews_data"
MONGO_DB = "cognito_feed"
MONGO_COLLECTION = "gnews_data"
BATCH_SIZE = 500  # Insert into Mongo in chunks

# ---------- TASK FUNCTION ----------
def bq_to_mongo(**context):
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
        # Convert datetime fields to Python datetime (Mongo compatible)
        for key, value in row_dict.items():
            if isinstance(value, datetime.datetime):
                row_dict[key] = value
        rows.append(row_dict)

    # Insert into MongoDB
    mongo_client = MongoClient(MONGODB_URI)
    collection = mongo_client[MONGO_DB][MONGO_COLLECTION]

    # Batch insert
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        if batch:
            collection.insert_many(batch)

    mongo_client.close()
    print(f"Inserted {len(rows)} documents into {MONGO_DB}.{MONGO_COLLECTION}")

# ---------- DAG DEFINITION ----------
with DAG(
    dag_id="bq_to_mongo_transfer",
    default_args={"owner": "airflow"},
    description="Transfer BigQuery table data to MongoDB collection",
    schedule_interval=None,  # Change to cron if you want periodic runs
    start_date=days_ago(1),
    catchup=False,
    tags=["bigquery", "mongodb", "transfer"],
) as dag:

    transfer_task = PythonOperator(
        task_id="transfer_bq_to_mongo",
        python_callable=bq_to_mongo,
        provide_context=True,
    )

    transfer_task

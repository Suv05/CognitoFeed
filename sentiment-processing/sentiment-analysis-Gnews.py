import json
import re
import uuid
import hashlib
from datetime import datetime, timezone
from urllib.parse import urlparse

import emoji
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

import apache_beam as beam
from apache_beam.options.pipeline_options import (
    PipelineOptions,
    StandardOptions,
    GoogleCloudOptions,
    WorkerOptions,
)
from apache_beam.io.gcp.bigquery import WriteToBigQuery, BigQueryDisposition

# ------------- CONFIG -------------
PROJECT_ID = "primal-outrider--q3"
REGION = "asia-south1"

SUBSCRIPTION = "projects/primal-outrider--q3/subscriptions/raw-gnews-pub-sub"

BQ_DATASET = "gnews_sentiment"
BQ_TABLE = "gnews_data"
TABLE_SPEC = f"{PROJECT_ID}:{BQ_DATASET}.{BQ_TABLE}"

TEMP_BUCKET = f"gs://{PROJECT_ID}-dataflow-temp/temp"
STAGING_BUCKET = f"gs://{PROJECT_ID}-dataflow-temp/staging"

# ------------- REGEX / HELPERS -------------
URL_REGEX = re.compile(r"http\S+|www\S+")
NON_ALNUM_REGEX = re.compile(r"[^a-zA-Z0-9\s]")

def clean_text(text: str) -> str:
    text = (text or "").strip()
    text = emoji.replace_emoji(text, replace="")
    text = URL_REGEX.sub("", text)
    text = NON_ALNUM_REGEX.sub(" ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

CATEGORY_KEYWORDS = {
    "world": [
        "global", "geopolitics", "war", "conflict", "united nations", "europe",
        "asia", "africa", "middle east", "international"
    ],
    "nation": [
        "election", "parliament", "government", "state", "minister", "policy",
        "lok sabha", "rajya sabha", "supreme court"
    ],
    "business": [
        "market", "stock", "ipo", "revenue", "profit", "merger", "acquisition",
        "inflation", "gdp", "etf", "interest rate", "economy", "bank", "finance"
    ],
    "technology": [
        "ai", "artificial intelligence", "software", "hardware", "chip", "semiconductor",
        "google", "microsoft", "openai", "amazon", "apple", "samsung",
        "cybersecurity", "startup", "saas"
    ],
    "entertainment": [
        "movie", "film", "series", "actor", "actress", "bollywood", "hollywood",
        "music", "show", "entertainment"
    ],
    "sports": [
        "football", "soccer", "cricket", "ipl", "world cup", "nba", "fifa",
        "tennis", "olympics"
    ],
    "science": [
        "research", "study", "nasa", "space", "physics", "chemistry", "biology",
        "astronomy", "quantum", "lab"
    ],
    "health": [
        "health", "covid", "vaccine", "medical", "doctor", "hospital",
        "disease", "mental health", "who"
    ],
}

def categorize(text: str) -> str:
    if not text:
        return "general"
    t = text.lower()
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(k in t for k in kws):
            return cat
    return "general"


def safe_get(dct, *path, default=None):
    cur = dct
    for p in path:
        if not isinstance(cur, dict):
            return default
        cur = cur.get(p)
        if cur is None:
            return default
    return cur


def extract_domain(url: str) -> str:
    if not url:
        return None
    try:
        return urlparse(url).netloc
    except Exception:
        return None


def word_count(text: str) -> int:
    if not text:
        return 0
    return len(text.split())


def sha1(s: str) -> str:
    return hashlib.sha1((s or "").encode("utf-8")).hexdigest()


# ------------- BEAM DoFns -------------
class ParseJsonDoFn(beam.DoFn):
    def process(self, element):
        try:
            yield json.loads(element.decode("utf-8"))
        except Exception:
            # Could push to DLQ here
            return


class PreprocessDoFn(beam.DoFn):
    def process(self, obj):
        # Combine multiple textual fields for analysis
        full_text = " ".join(
            filter(
                None,
                [
                    obj.get("title"),
                    obj.get("description"),
                    obj.get("content"),
                ],
            )
        ).strip()

        cleaned = clean_text(full_text)
        obj["__full_text"] = full_text
        obj["__clean_text"] = cleaned
        obj["__domain"] = extract_domain(obj.get("url"))
        obj["__word_count"] = word_count(cleaned)
        obj["__char_count"] = len(cleaned)
        yield obj


class SentimentDoFn(beam.DoFn):
    def setup(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def process(self, obj):
        text = obj.get("__clean_text", "")
        if not text:
            obj["__sentiment"] = None
            obj["__sentiment_score"] = None
            yield obj
            return

        scores = self.analyzer.polarity_scores(text)
        comp = scores["compound"]
        if comp >= 0.05:
            label = "positive"
        elif comp <= -0.05:
            label = "negative"
        else:
            label = "neutral"

        obj["__sentiment"] = label
        obj["__sentiment_score"] = float(comp)
        yield obj


class TopicDoFn(beam.DoFn):
    def process(self, obj):
        obj["__category"] = categorize(obj.get("__clean_text", ""))
        yield obj


class EnrichForBQDoFn(beam.DoFn):
    def process(self, obj):
        now = datetime.now(timezone.utc).isoformat()
        # Prefer upstream provided ID; fallback to hash
        original_id = obj.get("id")
        if not original_id:
            original_id = sha1(obj.get("url") or obj.get("__full_text") or str(uuid.uuid4()))

        yield {
            # Identifiers
            "article_id": original_id,
            "insert_id": sha1(original_id),  # useful to avoid duplicates in BQ streaming
            "hashed": sha1(obj.get("__full_text", "")),

            # Original fields
            "title": obj.get("title"),
            "description": obj.get("description"),
            "content": obj.get("content"),
            "url": obj.get("url"),
            "image_url": obj.get("image"),
            "published_at": obj.get("publishedAt"),

            # Source
            "source_id": safe_get(obj, "source", "id"),
            "source_name": safe_get(obj, "source", "name"),
            "source_url": safe_get(obj, "source", "url"),

            # Derived
            "domain": obj.get("__domain"),
            "clean_text": obj.get("__clean_text"),
            "word_count": obj.get("__word_count"),
            "char_count": obj.get("__char_count"),
            "sentiment": obj.get("__sentiment"),
            "sentiment_score": obj.get("__sentiment_score"),
            "category": obj.get("__category"),

            # Ops
            "processed_at": now,
            "ingest_ts": now,
        }


def run():
    # Pipeline options
    opts = PipelineOptions(save_main_session=True, streaming=True)

    gcp_opts = opts.view_as(GoogleCloudOptions)
    gcp_opts.project = PROJECT_ID
    gcp_opts.region = REGION
    gcp_opts.job_name = "gnews-sentiment-pipeline-v3"
    gcp_opts.temp_location = TEMP_BUCKET
    gcp_opts.staging_location = STAGING_BUCKET

    std_opts = opts.view_as(StandardOptions)
    std_opts.runner = "DataflowRunner"  # change to DirectRunner for local tests
    std_opts.streaming = True

    worker_opts = opts.view_as(WorkerOptions)
    worker_opts.machine_type = "e2-small"
    worker_opts.num_workers = 1
    worker_opts.max_num_workers = 3
    worker_opts.autoscaling_algorithm = "THROUGHPUT_BASED"

    table_schema = {
        "fields": [
            # Identifiers
            {"name": "article_id", "type": "STRING", "mode": "REQUIRED"},
            {"name": "insert_id", "type": "STRING", "mode": "NULLABLE"},
            {"name": "hashed", "type": "STRING", "mode": "NULLABLE"},

            # Originals
            {"name": "title", "type": "STRING", "mode": "NULLABLE"},
            {"name": "description", "type": "STRING", "mode": "NULLABLE"},
            {"name": "content", "type": "STRING", "mode": "NULLABLE"},
            {"name": "url", "type": "STRING", "mode": "NULLABLE"},
            {"name": "image_url", "type": "STRING", "mode": "NULLABLE"},
            {"name": "published_at", "type": "TIMESTAMP", "mode": "NULLABLE"},

            # Source
            {"name": "source_id", "type": "STRING", "mode": "NULLABLE"},
            {"name": "source_name", "type": "STRING", "mode": "NULLABLE"},
            {"name": "source_url", "type": "STRING", "mode": "NULLABLE"},

            # Derived
            {"name": "domain", "type": "STRING", "mode": "NULLABLE"},
            {"name": "clean_text", "type": "STRING", "mode": "NULLABLE"},
            {"name": "word_count", "type": "INTEGER", "mode": "NULLABLE"},
            {"name": "char_count", "type": "INTEGER", "mode": "NULLABLE"},
            {"name": "sentiment", "type": "STRING", "mode": "NULLABLE"},
            {"name": "sentiment_score", "type": "FLOAT", "mode": "NULLABLE"},
            {"name": "category", "type": "STRING", "mode": "NULLABLE"},

            # Ops
            {"name": "processed_at", "type": "TIMESTAMP", "mode": "REQUIRED"},
            {"name": "ingest_ts", "type": "TIMESTAMP", "mode": "REQUIRED"},
        ]
    }

    with beam.Pipeline(options=opts) as p:
        (
            p
            | "ReadFromPubSub"
            >> beam.io.ReadFromPubSub(subscription=SUBSCRIPTION).with_output_types(bytes)
            | "ParseJSON" >> beam.ParDo(ParseJsonDoFn())
            | "Preprocess" >> beam.ParDo(PreprocessDoFn())
            | "Sentiment" >> beam.ParDo(SentimentDoFn())
            | "Category" >> beam.ParDo(TopicDoFn())
            | "EnrichForBQ" >> beam.ParDo(EnrichForBQDoFn())
            | "WriteToBQ"
            >> WriteToBigQuery(
                table=TABLE_SPEC,
                schema=table_schema,
                # If your table already exists with *no* schema, use CREATE_IF_NEEDED to let Beam create it.
                # If it exists with the same schema, WRITE_APPEND will work fine.
                write_disposition=BigQueryDisposition.WRITE_APPEND,
                create_disposition=BigQueryDisposition.CREATE_NEVER,
                insert_retry_strategy="RETRY_ON_TRANSIENT_ERROR",
            )
        )


if __name__ == "__main__":
    run()


#command for running the pipeline
# python sentiment-analysis-Gnews.py --runner=DataflowRunner --project=primal-outrider--q3 --region=asia-south1 --worker_zone=asia-south1-b --worker_machine_type=e2-small --num_workers=1 --max_num_workers=3 --temp_location=gs://primal-outrider--q3-dataflow-temp/temp --staging_location=gs://primal-outrider--q3-dataflow-temp/staging --job_name=GNEWS-sentiment-pipeline-v3 --streaming --requirements_file=requirements.txt --save_main_session
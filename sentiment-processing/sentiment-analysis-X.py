import json
import re
import emoji
import uuid
from datetime import datetime, timezone
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

import apache_beam as beam
from apache_beam.options.pipeline_options import (
    PipelineOptions,
    StandardOptions,
    GoogleCloudOptions,
    WorkerOptions,
)
from apache_beam.io.gcp.bigquery import WriteToBigQuery, BigQueryDisposition

# ---------- CONFIG ----------
PROJECT_ID = "primal-outrider--q3"
REGION = "asia-south1"
SUBSCRIPTION = f"projects/primal-outrider--q3/subscriptions/raw-x-posts-sub" 
BQ_DATASET = "xs_sentiment"
BQ_TABLE = "x_data"  # PROJECT:DATASET.TABLE -> primal-outrider--q3.xs_sentiment.x_data
TABLE_SPEC = f"{PROJECT_ID}:{BQ_DATASET}.{BQ_TABLE}"

# ---------- HELPERS ----------
URL_REGEX = re.compile(r"http\S+|www\S+")
MENTION_REGEX = re.compile(r"@\w+")
HASHTAG_REGEX = re.compile(r"#\w+")
NON_ALNUM_REGEX = re.compile(r"[^a-zA-Z0-9\s]")


def clean_text(text: str) -> str:
    text = text or ""
    text = text.lower()
    text = URL_REGEX.sub("", text)
    text = MENTION_REGEX.sub("", text)
    text = HASHTAG_REGEX.sub("", text)
    text = emoji.replace_emoji(text, replace="")
    text = NON_ALNUM_REGEX.sub(" ", text)
    return re.sub(r"\s+", " ", text).strip()


TOPIC_KEYWORDS = {
    "finance": ["stock", "market", "bitcoin", "nasdaq", "dow", "s&p", "nifty", "bank"],
    "politics": [
        "election",
        "president",
        "bjp",
        "congress",
        "trump",
        "biden",
        "parliament",
    ],
    "technology": [
        "ai",
        "artificial intelligence",
        "google",
        "microsoft",
        "openai",
        "apple",
        "samsung",
    ],
    "sports": ["football", "soccer", "nba", "ipl", "cricket", "world cup", "fifa"],
    "entertainment": [
        "movie",
        "film",
        "series",
        "drama",
        "actor",
        "entertainment",
        "bollywood",
        "hollywood",
    ],
    "environment": [
        "climate",
        "global warming",
        "pollution",
        "sustainability",
        "green",
    ],
    "education": ["education", "school", "college", "university", "student", "teacher"],
    "travel": ["travel", "tourism", "vacation", "flight", "hotel", "destination"],
    "lifestyle": [
        "lifestyle",
        "health",
        "wellness",
        "fitness",
        "food",
        "fashion",
    ],
}


def detect_topic(text: str) -> str:
    t = text.lower()
    for topic, keywords in TOPIC_KEYWORDS.items():
        if any(k in t for k in keywords):
            return topic
    return "general"


# ---------- BEAM DOFNs ----------
class ParseJsonDoFn(beam.DoFn):
    def process(self, element):
        # element is bytes from Pub/Sub
        try:
            obj = json.loads(element.decode("utf-8"))
            yield obj
        except Exception as e:
            # optionally route to dead-letter
            return


class PreprocessDoFn(beam.DoFn):
    def process(self, obj):
        text = obj.get("text", "")
        cleaned = clean_text(text)
        obj["clean_text"] = cleaned
        yield obj


# class SentimentDoFn(beam.DoFn):
#     def setup(self):
#         # Load once per worker
#         from transformers import (
#             AutoTokenizer,
#             AutoModelForSequenceClassification,
#             pipeline,
#         )

#         self.model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
#         self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
#         self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
#         self.pipe = pipeline(
#             "sentiment-analysis",
#             model=self.model,
#             tokenizer=self.tokenizer,
#             device=-1,  # CPU
#         )

#         # Map model labels to readable ones if needed
#         # (Cardiff returns: LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive))
#         self.label_map = {0: "negative", 1: "neutral", 2: "positive"}

#     def process(self, obj):
#         text = obj.get("clean_text", "")
#         if not text:
#             obj["sentiment"] = None
#             obj["sentiment_score"] = None
#             yield obj
#             return

#         res = self.pipe(text[:512])[0]
#         label = res["label"]
#         score = float(res["score"])

#         # Normalize label if needed
#         if label.startswith("LABEL_"):
#             idx = int(label.split("_")[-1])
#             label = self.label_map.get(idx, label)

#         obj["sentiment"] = label
#         obj["sentiment_score"] = score
#         yield obj


class SentimentDoFn(beam.DoFn):
    def setup(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def process(self, obj):
        text = obj.get("clean_text", "")
        if not text:
            obj["sentiment"] = None
            obj["sentiment_score"] = None
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

        obj["sentiment"] = label
        obj["sentiment_score"] = float(comp)
        yield obj


class TopicDoFn(beam.DoFn):
    def process(self, obj):
        obj["topic"] = detect_topic(obj.get("clean_text", ""))
        yield obj


class EnrichForBQDoFn(beam.DoFn):
    def process(self, obj):
        now = datetime.now(timezone.utc).isoformat()
        yield {
            "article_id": str(uuid.uuid4()),
            "publication_date": obj.get("created_at"),
            "full_text": obj.get("text"),
            "clean_text": obj.get("clean_text"),
            "author": obj.get("author"),
            "language": obj.get("language"),
            "sentiment": obj.get("sentiment"),
            "sentiment_score": obj.get("sentiment_score"),
            "topic": obj.get("topic"),
            "processed_at": now,
        }


# ---------- MAIN ----------
def run():
    # Pipeline options
    opts = PipelineOptions(save_main_session=True)
    gcp_opts = opts.view_as(GoogleCloudOptions)
    gcp_opts.project = PROJECT_ID
    gcp_opts.region = REGION
    gcp_opts.temp_location = f"gs://{PROJECT_ID}-dataflow-temp/temp"
    gcp_opts.staging_location = f"gs://{PROJECT_ID}-dataflow-temp/staging"

    std_opts = opts.view_as(StandardOptions)
    std_opts.runner = "DataflowRunner"  # change to DirectRunner for local tests
    std_opts.streaming = True

    worker_opts = opts.view_as(WorkerOptions)
    worker_opts.machine_type = "e2-small"  # give PyTorch some CPU
    worker_opts.num_workers = 1
    worker_opts.max_num_workers = 3
    worker_opts.autoscaling_algorithm = "THROUGHPUT_BASED"

    table_schema = {
        "fields": [
            {"name": "article_id", "type": "STRING", "mode": "REQUIRED"},
            {"name": "publication_date", "type": "TIMESTAMP", "mode": "NULLABLE"},
            {"name": "full_text", "type": "STRING", "mode": "NULLABLE"},
            {"name": "clean_text", "type": "STRING", "mode": "NULLABLE"},
            {"name": "author", "type": "STRING", "mode": "NULLABLE"},
            {"name": "language", "type": "STRING", "mode": "NULLABLE"},
            {"name": "sentiment", "type": "STRING", "mode": "NULLABLE"},
            {"name": "sentiment_score", "type": "FLOAT", "mode": "NULLABLE"},
            {"name": "topic", "type": "STRING", "mode": "NULLABLE"},
            {"name": "processed_at", "type": "TIMESTAMP", "mode": "REQUIRED"},
        ]
    }

    with beam.Pipeline(options=opts) as p:
        (
            p
            | "ReadFromPubSub"
            >> beam.io.ReadFromPubSub(subscription=SUBSCRIPTION).with_output_types(
                bytes
            )
            | "ParseJSON" >> beam.ParDo(ParseJsonDoFn())
            | "Preprocess" >> beam.ParDo(PreprocessDoFn())
            | "Sentiment" >> beam.ParDo(SentimentDoFn())
            | "Topic" >> beam.ParDo(TopicDoFn())
            | "EnrichForBQ" >> beam.ParDo(EnrichForBQDoFn())
            | "WriteToBQ"
            >> WriteToBigQuery(
                table=TABLE_SPEC,
                schema=table_schema,
                write_disposition=BigQueryDisposition.WRITE_APPEND,
                create_disposition=BigQueryDisposition.CREATE_NEVER,
            )
        )


if __name__ == "__main__":
    run()

#command for running the pipeline
# python sentiment-analysis-X.py --runner=DataflowRunner --project=primal-outrider--q3 --region=asia-south1 --worker_zone=asia-south1-b --worker_machine_type=e2-small --num_workers=1 --max_num_workers=3 --temp_location=gs://primal-outrider--q3-dataflow-temp/temp --staging_location=gs://primal-outrider--q3-dataflow-temp/staging --job_name=x-sentiment-pipeline-v3 --streaming --requirements_file=requirements.txt --save_main_session
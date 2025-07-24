import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions, StandardOptions, GoogleCloudOptions
from apache_beam.transforms.window import FixedWindows
from apache_beam.io import fileio

def run():
    project_id = "primal-outrider--q3"
    region = "asia-south1"

    subscription = f"projects/{project_id}/subscriptions/raw-news-articles-sub"
    output_prefix = f"gs://{project_id}-raw-news-data/raw_articles/raw_news"
    temp_location = f"gs://{project_id}-dataflow-temp/temp"
    staging_location = f"gs://{project_id}-dataflow-temp/staging"

    options = PipelineOptions(save_main_session=True)
    google_cloud_options = options.view_as(GoogleCloudOptions)
    google_cloud_options.project = project_id
    google_cloud_options.region = region
    google_cloud_options.temp_location = temp_location
    google_cloud_options.staging_location = staging_location

    standard_options = options.view_as(StandardOptions)
    standard_options.runner = "DataflowRunner"
    standard_options.streaming = True

    with beam.Pipeline(options=options) as p:
        (
            p
            | "Read from Pub/Sub" >> beam.io.ReadFromPubSub(subscription=subscription).with_output_types(bytes)
            | "Decode message" >> beam.Map(lambda msg: msg.decode("utf-8"))
            | "Window into 5 min" >> beam.WindowInto(FixedWindows(5 * 60))
            | "Write windowed files" >> fileio.WriteToFiles(
                path=output_prefix,
                shards=1,
                file_naming=fileio.default_file_naming("raw_news", ".jsonl")
            )
        )

if __name__ == "__main__":
    run()

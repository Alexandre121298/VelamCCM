import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.io.textio import ReadFromText
from apache_beam.io.gcp.internal.clients import bigquery
import json
import argparse
import os
import logging

beam_options = PipelineOptions(
    runner='DirectRunner'
)

table_spec = bigquery.TableReference(
    projectId='velamccm',
    datasetId='velam_dataset',
    tableId='amiens')

table_schema = {
    'fields': [
        {'name': 'nom_station', 'type': 'STRING', 'mode': 'NULLABLE'}
        ]
}

class StationName(beam.DoFn):
    def process(self, stations):
        return [station for station in stations]
    
with beam.Pipeline() as p:
    (p | "Read" >> beam.io.ReadFromText('gs://velam_bucket/1697465441448_response.json')
    | "Lit les données" >> beam.Map(lambda line: json.loads(line))
    | "Split les stations" >> beam.ParDo(StationName())
    | "Nom des stations" >> beam.Map(lambda station: station['name'] if station['name'] is not None else '')
    | "Mise en forme" >> beam.Map(lambda nom: {'nom_station': nom})
    | "Enregistre les données" >> beam.io.WriteToBigQuery(table_spec,
                                                          schema=table_schema,
                                                          custom_gcs_temp_location='gs://velam_bucket_temp',
                                                          write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE,
                                                          create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED))
    
    p.run()
    
##if __name__ == "__main__":
##    logging.getLogger().setLevel(logging.INFO)
##    run()
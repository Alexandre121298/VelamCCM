import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.io.textio import ReadFromText
from apache_beam.io.gcp.internal.clients import bigquery
import json
import argparse
import os
import logging

beam_options = PipelineOptions(
    runner="DataflowRunner",
    project="velamccm",
    job_name="bucket-to-bigquery",
    region="europe-west9",
)

table_spec = bigquery.TableReference(
    projectId='velamccm',
    datasetId='velam_dataset',
    tableId='amiens')

table_schema = {
    'fields': [
        {'name': 'nom_station', 'type': 'STRING', 'mode': 'NULLABLE'},
        {'name': 'support_velo', 'type': 'INTEGER', 'mode': 'NULLABLE'},
        {'name': 'support_velo_disponible', 'type': 'INTEGER', 'mode': 'NULLABLE'},
        {'name': 'velo_disponible', 'type': 'INTEGER', 'mode': 'NULLABLE'},
        {'name': 'etat', 'type': 'STRING', 'mode': 'NULLABLE'},
        {'name': 'derniere_mise_a_jour', 'type': 'INTEGER', 'mode': 'NULLABLE'},
        ]
}

class StationName(beam.DoFn):
    def process(self, stations):
        return [station for station in stations]
    
with beam.Pipeline(options=beam_options) as p:
    (p | "Read" >> beam.io.ReadFromText('gs://velam_bucket/')
       | "Lit les données" >> beam.Map(lambda line: json.loads(line))
       | "Split les stations" >> beam.ParDo(StationName())
       | "Nom des stations" >> beam.Map(lambda station: {
            "nom_station": station.get("name", ""),
            "support_velo": station.get("bike_stands", None),
            "support_velo_disponible": station.get("available_bike_stands", None),
            "velo_disponible": station.get("available_bikes", None),
            "etat": station.get("status", ""),
            "derniere_mise_a_jour": station.get("last_update", ""),
       })
       | "Enregistre les données" >> beam.io.WriteToBigQuery(table_spec,
                                                              schema=table_schema,
                                                              custom_gcs_temp_location='gs://velam_bucket_temp',
                                                              write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE,
                                                              create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED))
    p.run()
    
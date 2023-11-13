from google.cloud import bigquery

client = bigquery.Client()

dataset_id = "{}.velam_dataset".format(client.project)

dataset = bigquery.Dataset(dataset_id)
dataset.location = "europe-west9"

dataset = client.create_dataset(dataset, timeout=30)
print("Created dataset {}.{}".format(client.project, dataset.dataset_id))
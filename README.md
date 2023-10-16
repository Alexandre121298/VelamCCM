### VelamCCM
Projet Paas Google Master CCM 2 - Velam 

----------------------------------------------------------------------------------------------

## Budgétisation : 

### Tarifs pour le google Scheduler : 
0,10 $ par tache et par mois.

### Tarifs pour la google functions : 

Le raffraichissement des données de JCDecaux etant toutes les minutes nous allons lancé la fonctions GCP toute les 15min afin d'actueliser régulierement les données. 

On a donc 4 requètes par heure. Soit 96 requetes en 1 journée.
1 mois = 30jours => 96 * 30 = **2880 requete par mois**
L'appel sera en permanence gratuit car ~2900 requetes < 2 000 000. 

Calcul du poids total : 

2880 * 10 = 28800 ko -> 28.8 GO
28 go * 0.026 = **0.728$ pour le stockage du bucket**

On ajoute le cloud scheduler
0.728 + 0.10 = **0.828$**

**Temps de calcul**

(128 Mo / 1 024 Mo/Go) x 0,3 s = 0,0375 Go-seconde par appel

(200 MHz / 1 000 MHz/GHz) x 0,3 s = 0,600 GHz-seconde par appel

2880 d'appels x 0,0375 Go-seconde = 108 Go-seconde par mois

2880 d'appels x 0,0600 GHz-seconde = 172.8 GHz-seconde par mois


Métrique | Valeur brute | Version gratuite | Valeur nette | Prix unitaire | Prix total
--- | --- | --- | --- |--- |--- 
GHz-seconde | 600 000 | 200 000 | 400 000 | 0,0000100$ | 4,00$
Total par mois | --- | --- | --- |--- | 4,00$

Pour le total on a désormais = 4.00 + 0.828 = 4.828$

Pub/Sub = on ira jamais au dessus de 10go, donc gratuit (voire le partie sur la tarifications du pub/sub).

Le prix total serait de 4.828$/mois

### Tarifs pour le Bucket : 

On utilise l'emplacement "Europe-west9 - Paris" qui sera facturé 0,023$ par mois et par Go.

### Tarifs pour le pub/sub : 
Gratuit. Selon la documentation GCP concernant les pub/sub , les 10 premiers Gio de débit de message sont gratuit chaque début de mois. 

----------------------------------------------------------------------------------------------
### Authentification : 

```gcloud auth login```

### Creation d'un pub/sub : 

Nous allons ici creer un pub/sub nommé velam-topic en utilisant cette commande : 

``` bash
gcloud pubsub topics create velam-topic 
gcloud pubsub subscriptions create my-sub --topic=velam-topic
```

### Creation du Bucket : 

On va ensuite créé un bucket où l'on va stocker les fichiers JSON récupérer depuis l'API JCDecaux : 

```bash
gcloud storage buckets create gs://velam_bucket --project=velamccm --location=europe-west9
```

### Creation de la google Function : 

```bash
gcloud functions deploy velamCloudFunction 
--gen2 
--runtime=nodejs18 
--region=europe-west9 
--source="D:\Etudes\MasterCCM\PaaS Google\GCP\VelamCCM\gcp-function" 
--entry-point=myCloudFunction 
--memory 128Mi 
--trigger-topic velam-topic 
--allow-unauthenticated
```
source etant le dossier contenant la fonction javascript

### Creation du Scheduler CRON : 

```bash
gcloud scheduler jobs create pubsub velamCronJob --schedule "*/15 * * * *" --topic velam-topic --message-body "run" --description "My scheduled job" --location=europe-west3
```

-----------------------------------------------------------------------------------------------

### Lien concernant le Scheduler :

https://cloud.google.com/scheduler/pricing?hl=fr --> Tarifs du scheduler.

https://cloud.google.com/scheduler/docs?hl=fr --> Documentation du scheduler.


### Lien concernant le Pub/Sub : 

https://cloud.google.com/pubsub/pricing?hl=fr --> 
Tarification du pub/Sub

### Lien API JCDecaux : 
Raffraichissement des données de JCDecaux : toutes les minutes. 
https://developer.jcdecaux.com/#/home


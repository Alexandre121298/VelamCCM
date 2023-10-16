const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config({ path: 'process.env' });


exports.myCloudFunction = async (req, res) => {
    try {
      // Retrieve the apiKey from the .yml file or any other source
      const apiKey = process.env.API_KEY
      console.log(apiKey)
  
      //Au cas ou si l'API ne répond pas
  
      const check = await axios.get(`https://api.jcdecaux.com/vls/v1/stations?contract=amiens&apiKey=${apiKey}`);
    
      if (check.status !== 200) {
          throw new Error('API not accessible');
      }
  
      //Make the GET request
      const response = await axios.get(`https://api.jcdecaux.com/vls/v1/stations?contract=amiens&apiKey=${apiKey}`);
  
      console.log(response)
  
      // Store the response in a GCP bucket
      const storage = new Storage({
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        });
      const bucket = storage.bucket('velam_bucket');
      //Nom du fichier
      const file = bucket.file(`${Date.now()}_response.json`);
      await file.save(JSON.stringify(response.data));
  
      res.status(200).send('Response stored in GCP bucket successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
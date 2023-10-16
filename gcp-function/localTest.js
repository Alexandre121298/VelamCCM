const { myCloudFunction } = require('./function');

const req = {}; // Mock request object
const res = {
  status: function (statusCode) {
    console.log('Status:', statusCode);
    return this;
  },
  send: function (message) {
    console.log('Response:', message);
    return this;
  },
}; // Mock response object

// Invoke the cloud function
myCloudFunction(req, res)
  .then(() => {
    console.log('Cloud function executed successfully');
  })
  .catch((error) => {
    console.error('Error executing cloud function:', error);
  });
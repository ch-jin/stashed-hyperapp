const SETTINGS = require('../settings.json');

module.exports = function setAWSCredentials(AWS) {
  AWS.config.setPromisesDependency(require('bluebird'));
  AWS.config.update({
    endpoint: new AWS.Endpoint(SETTINGS.S3.endpoint),
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  });
};
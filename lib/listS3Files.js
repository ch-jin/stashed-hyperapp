const AWS = require('aws-sdk');
const setAWSCredentials = require('./setAWSCredentials');
const SETTINGS = require('../settings.json');

setAWSCredentials(AWS);

module.exports = function listS3Files(callback) {
  new AWS.S3()
    .listObjects({ Bucket: SETTINGS.S3.bucket })
    .promise()
    .then(data => callback(data));
};

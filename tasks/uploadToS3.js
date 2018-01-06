const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const s3UploadStream = require('s3-upload-stream');
const SETTINGS = require('../settings.json');

const { endpoint, bucket, directories } = SETTINGS.s3;

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({
  endpoint: new AWS.Endpoint(endpoint),
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

const s3Stream = s3UploadStream(new AWS.S3());

new AWS.S3()
  .listObjects({ Bucket: bucket })
  .promise()
  .then(data => {
    const bucketFiles = data.Contents.map(obj => obj.Key);
    directories.forEach(dir => {
      fs.readdir(path.join(__dirname, dir.path), (err, files) => {
        files.forEach(fileName => {
          const fileDest = dir.bucketFolder + fileName;
          if (bucketFiles.includes(fileDest)) {
            return;
          }

          console.log(`Uploading ${fileName}`);

          const splitByPeriods = fileName.split('.');
          if (splitByPeriods.length === 1) {
            return;
          }

          const readStream = fs.createReadStream(
            path.join(__dirname, dir.path, fileName)
          );

          const s3Upload = s3Stream.upload({
            Bucket: bucket,
            Key: fileDest,
            ACL: 'public-read',
          });

          s3Upload.maxPartSize(20971520);

          readStream
            .pipe(s3Upload)
            .on('finish', () =>
              console.log(`${fileName} successfully uploaded.\n\n`)
            );
        });
      });
    });
  });

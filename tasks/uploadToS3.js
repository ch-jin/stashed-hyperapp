const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const s3UploadStream = require('s3-upload-stream');
const SETTINGS = require('../settings.json');
const listS3Files = require('../lib/listS3Files');
const setAWSCredentials = require('../lib/setAWSCredentials');

const { uploadDirectories, bucket } = SETTINGS.S3;

setAWSCredentials(AWS);
const s3Stream = s3UploadStream(new AWS.S3());

const uploadToS3 = fileNames => {
  uploadDirectories.forEach(dir => {
    fs.readdir(path.join(__dirname, dir.path), (err, files) => {
      files.forEach(fileName => {
        const fileDest = dir.bucketFolder + fileName;
        if (fileNames.includes(fileDest)) {
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
};

listS3Files(uploadToS3);

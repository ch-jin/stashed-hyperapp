const express = require('express');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const VIDEO_EXTENSIONS = require('./constants/videoExtensions.json');
const SETTINGS = require('./settings.json');
const listS3Files = require('./lib/listS3Files');

const pathToFiles = path.join(__dirname, process.env['STASHED_DIR_PATH']);

const app = express();
app.use(express.static(__dirname));
app.use(express.static(pathToFiles));

app.get('/api/files', (req, res) => {
  SETTINGS.S3.enabled
    ? readAndSendS3Files(req, res)
    : readAndSendLocalFiles(req, res);
});

const readAndSendS3Files = (req, res) => {
  listS3Files(fileNames => {
    let data = [];

    fileNames.forEach(fileName => {
      const splitByPeriods = fileName.split('.');
      const extension = splitByPeriods[splitByPeriods.length - 1];
      const pathName = `${SETTINGS.S3.assetEndpoint}/${fileName}`;

      // Exclude .vtt
      if (extension === 'vtt') {
        return;
      }

      let fileData = { path: pathName, name: fileName };

      if (VIDEO_EXTENSIONS.includes(extension)) {
        fileData.type = 'video';

        const subFileName = fileName.replace('.' + extension, '.vtt');
        const subFilePath = `subtitles/${subFileName}`;
        if (fileNames.includes(subFilePath)) {
          fileData.subtitleSrc = `${SETTINGS.S3.assetEndpoint}/${subFilePath}`;
        }
      }

      data.push(fileData);
    });

    return res.json(data);
  });
};

const readAndSendLocalFiles = (req, res) => {
  fs.readdir(pathToFiles, (err, fileNames) => {
    let data = [];

    fileNames.forEach(fileName => {
      // Exclude dot files
      if (fileName[0] === '.') {
        return;
      }

      const splitByPeriods = fileName.split('.');
      const extension = splitByPeriods[splitByPeriods.length - 1];
      const pathName = `${process.env['STASHED_DIR_PATH']}/${fileName}`;

      // Exclude directories
      if (splitByPeriods.length === 1) {
        return;
      }

      let fileData = { path: pathName, name: fileName };

      if (VIDEO_EXTENSIONS.includes(extension)) {
        fileData.type = 'video';

        const subFileName = fileName.replace('.' + extension, '.vtt');
        const subFilePath = `${pathToFiles}/subtitles/${subFileName}`;
        if (fs.existsSync(subFilePath)) {
          fileData.subtitleSrc = `${
            process.env['STASHED_DIR_PATH']
          }/subtitles/${subFileName}`;
        }
      }

      data.push(fileData);
    });

    return res.json(data);
  });
};

app.listen(8080, () => console.log('stashed-hyperapp is listening on 8080'));

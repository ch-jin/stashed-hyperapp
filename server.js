const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const VIDEO_EXTENSIONS = require('./constants/videoExtensions.json');

const pathToFiles = path.join(__dirname, process.env['STASHED_DIR_PATH']);

app.use(express.static(__dirname));
app.use(express.static(pathToFiles));

app.get('/api/files', (req, res) => {
  fs.readdir(pathToFiles, (err, fileNames) => {
    let data = [];

    fileNames.forEach(fileName => {
      // Exclude dot files
      if (fileName[0] === '.') {
        return;
      }

      const extension = fileName.split('.')[1];
      const pathName = `${process.env['STASHED_DIR_PATH']}/${fileName}`;

      // Exclude directories
      if (typeof extension === 'undefined') {
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
});

app.listen(8080, () => console.log('stashed-hyperapp is listening on 8080'));

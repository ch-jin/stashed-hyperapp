const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static(__dirname));

app.get('/api/files', (req, res) => {
  const pathToFiles = path.join(
    __dirname,
    process.env['STASHED_DIR_PATH']
  );
  fs.readdir(pathToFiles, (err, fileNames) => {
    // Exclude dot files
    const data = fileNames.filter(fileName => fileName[0] !== '.');
    return res.json(data);
  });
});

app.listen(8080, () => console.log('stashed-hyperapp is listening on 8080'));

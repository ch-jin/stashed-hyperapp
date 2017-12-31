// Run this as a separate task when necessary.

const fs = require('fs');
const path = require('path');
const MatroskaSubtitles = require('matroska-subtitles');
const srt2vtt = require('srt-to-vtt');
const msToTime = require('../lib/msToTime');
const removeBrackets = require('../lib/removeBrackets');

const pathToFiles = path.join(
  __dirname,
  '../',
  process.env['STASHED_DIR_PATH']
);

const runMkvSubExtractions = () => {
  fs.readdir(pathToFiles, (err, fileNames) => {
    fileNames.forEach(fileName => {
      if (fileName.includes('.mkv')) {
        extractSubsToSrt(fileName);
      }
    });
  });
};

const extractSubsToSrt = fileName => {
  let counter = 1;
  const filePath = `${pathToFiles}/${fileName}`;
  const subFileName = fileName.replace('.mkv', '.srt');
  const subFilePath = `${pathToFiles}/subtitles/${subFileName}`;

  const mkvParser = new MatroskaSubtitles();
  const subFileStream = fs.createWriteStream(subFilePath);

  mkvParser.on('subtitle', (subtitle, trackNumber) => {
    const endMs = parseInt(subtitle.time) + parseInt(subtitle.duration);
    const start = msToTime(subtitle.time);
    const end = msToTime(endMs);

    let text = subtitle.text.replace('\\N', '\r\n');
    text = removeBrackets(text);

    const subSnippet =
      `${counter++}\r\n` +
      `${start} --> ${end} line:14 position:50% align:center size:100%\r\n` +
      `${text}\r\n\r\n`;

    subFileStream.write(subSnippet);
  });

  mkvParser.on('finish', () => {
    convertSrtToVtt(subFilePath);
  });

  fs.createReadStream(filePath).pipe(mkvParser);
};

const convertSrtToVtt = srtFilePath => {
  const vttFilePath = srtFilePath.replace('.srt', '.vtt');
  fs
    .createReadStream(srtFilePath)
    .pipe(srt2vtt())
    .pipe(fs.createWriteStream(vttFilePath))
    .on('finish', () => fs.unlink(srtFilePath));
};

runMkvSubExtractions();

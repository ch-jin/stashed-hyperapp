import { h, app } from 'hyperapp';
import VideoPlayer from './VideoPlayer';
import FileList from './FileList';

const appState = {
  files: [],
  selectedFile: {
    name: '',
    path: '',
    type: '',
  },
  videoPlayer: {
    isHover: false,
    isPlaying: true,
  },
};

const appActions = {
  fetchFile: () => state => fetch('/api/files').then(res => res.json()),
  replaceFile: files => ({ files }),
  selectFile: file => ({ selectedFile: file }),
  toggleVideoPlayerHover: () => ({ videoPlayer }) => {
    const { isHover } = videoPlayer;
    return {
      videoPlayer: Object.assign({}, videoPlayer, {
        isHover: !videoPlayer.isHover,
      }),
    };
  },
  handlePlayPause: event => ({ videoPlayer }) => {
    const { isPlaying } = videoPlayer;
    const videoEle = document.querySelector('video');
    isPlaying ? videoEle.pause() : videoEle.play();
    return {
      videoPlayer: Object.assign({}, videoPlayer, { isPlaying: !isPlaying }),
    };
  },
};

const view = (state, actions) => {
  const { files, selectedFile, videoPlayer } = state;
  const {
    fetchFile,
    replaceFile,
    selectFile,
    toggleVideoPlayerHover,
    handlePlayPause,
  } = actions;

  const fetchAndReceiveFile = () => fetchFile().then(data => replaceFile(data));

  return (
    <div oncreate={fetchAndReceiveFile}>
      <VideoPlayer
        handlePlayPause={handlePlayPause}
        toggleVideoPlayerHover={toggleVideoPlayerHover}
        videoPlayer={videoPlayer}
        selectedFile={selectedFile}
      />
      <div className="menu-container">
        <h1>Stashed</h1>
        <FileList files={files} selectFile={selectFile} />
      </div>
    </div>
  );
};

app(appState, appActions, view, document.body);

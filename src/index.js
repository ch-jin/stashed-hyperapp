import { h, app } from 'hyperapp';
import BasicVideoPlayer from './BasicVideoPlayer';
import CustomVideoPlayer from './CustomVideoPlayer';
import FileList from './FileList';
import SETTINGS from '../settings.json';

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
    isFullScreen: false,
  },
};

const appActions = {
  fetchFile: () => state => fetch('/api/files').then(res => res.json()),
  replaceFile: files => ({ files }),
  selectFile: file => ({ selectedFile: file }),
  toggleVideoPlayerHover: () => ({ videoPlayer }) => {
    const { isHover, isPlaying } = videoPlayer;
    if (!isPlaying) {
      return {
        videoPlayer: Object.assign({}, videoPlayer, {
          isHover: true,
        }),
      };
    }
    return {
      videoPlayer: Object.assign({}, videoPlayer, {
        isHover: !videoPlayer.isHover,
      }),
    };
  },
  handlePlayPause: event => ({ videoPlayer }) => {
    const { isHover, isPlaying } = videoPlayer;
    const videoEle = document.querySelector('video');
    isPlaying ? videoEle.pause() : videoEle.play();
    return {
      videoPlayer: Object.assign({}, videoPlayer, {
        isPlaying: !isPlaying,
        isHover: isHover || !isPlaying,
      }),
    };
  },
  toggleFullScreen: event => ({ videoPlayer }) => {
    const { isFullScreen } = videoPlayer;
    const videoContainer = document.querySelector('.video-container');
    isFullScreen
      ? document.webkitExitFullscreen()
      : videoContainer.webkitRequestFullScreen();
    return {
      videoPlayer: Object.assign({}, videoPlayer, {
        isFullScreen: !isFullScreen,
      }),
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
    toggleFullScreen,
    handleVideoKeyDown,
  } = actions;

  const fetchAndReceiveFile = () => fetchFile().then(data => replaceFile(data));

  return (
    <div oncreate={fetchAndReceiveFile}>
      {SETTINGS.S3.customVideoPlayer ? (
        <CustomVideoPlayer
          handleVideoKeyDown={handleVideoKeyDown}
          videoPlayer={videoPlayer}
          selectedFile={selectedFile}
          handlePlayPause={handlePlayPause}
          toggleFullScreen={toggleFullScreen}
          toggleVideoPlayerHover={toggleVideoPlayerHover}
        />
      ) : (
        <BasicVideoPlayer selectedFile={selectedFile} />
      )}

      <div className="menu-container">
        <h1>Stashed</h1>
        <FileList files={files} selectFile={selectFile} />
      </div>
    </div>
  );
};

app(appState, appActions, view, document.body);

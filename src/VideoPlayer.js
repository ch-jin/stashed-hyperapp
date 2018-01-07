import { h } from 'hyperapp';
import classNames from 'classnames';

export const VideoPlayer = ({
  videoPlayer: { isHover, isPlaying },
  toggleVideoPlayerHover,
  selectedFile,
  handlePlayPause,
  toggleFullScreen,
}) => {
  if (selectedFile.type !== 'video') {
    return null;
  }

  const videoContainerClass = classNames({
    'video-container': true,
    'video-controls-hide': !isHover,
  });

  return (
    <div
      onmouseenter={toggleVideoPlayerHover}
      onmouseleave={toggleVideoPlayerHover}
      className={videoContainerClass}
    >
      <video
        onprogress={({ currentTarget: { buffered, duration } }) => {
          try {
            const bufferPercent =
              buffered.end(buffered.length - 1) / duration * 100;
            const bufferBar = document.querySelector('.buffer-bar');
            bufferBar.style.width = `${bufferPercent}%`;
          } catch (err) {
            console.log(err);
          }
        }}
        ontimeupdate={({ currentTarget: { currentTime, duration } }) => {
          const progressPercent = currentTime / duration * 100;
          const progressBar = document.querySelector('.progress-bar');
          progressBar.style.width = `${progressPercent}%`;
        }}
        key={selectedFile.name}
        autoplay
        crossorigin="anonymous"
      >
        <source src={selectedFile.path} />
        {selectedFile.subtitleSrc && (
          <track
            default
            label="English"
            kind="subtitles"
            srclang="en"
            src={selectedFile.subtitleSrc}
          />
        )}
      </video>
      <div className="video-controls">
        <div
          onclick={({ offsetX, currentTarget: { offsetWidth } }) => {
            const seekCoefficient = offsetX / offsetWidth;
            const videoEle = document.querySelector('video');
            videoEle.currentTime = videoEle.duration * seekCoefficient;
          }}
          className="progress-container"
        >
          <div className="buffer-bar" />
          <div className="progress-bar" />
        </div>
        <div className="left-controls">
          {isPlaying ? (
            <i onclick={handlePlayPause} className="play-pause fa fa-pause" />
          ) : (
            <i onclick={handlePlayPause} className="play-pause fa fa-play" />
          )}
        </div>
        <div className="right-controls">
          <i onclick={toggleFullScreen} className="play-pause fa fa-expand" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

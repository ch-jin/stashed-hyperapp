import { h } from 'hyperapp';
import classNames from 'classnames';

export const VideoPlayer = ({
  videoPlayer: { isHover, isPlaying },
  toggleVideoPlayerHover,
  selectedFile,
  handlePlayPause,
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
      <video key={selectedFile.name} autoplay crossorigin="anonymous">
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
        <div className="left-controls">
          {isPlaying ? (
            <i onclick={handlePlayPause} className="play-pause fa fa-pause" />
          ) : (
            <i onclick={handlePlayPause} className="play-pause fa fa-play" />
          )}
        </div>
        <div className="right-controls">
          <i className="play-pause fa fa-expand" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

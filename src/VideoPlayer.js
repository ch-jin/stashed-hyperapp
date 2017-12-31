import { h } from 'hyperapp';

export const VideoPlayer = ({ selectedFile }) =>
  selectedFile.type === 'video' ? (
    <video key={selectedFile.name} controls autoplay>
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
  ) : null;

export default VideoPlayer;

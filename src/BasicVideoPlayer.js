import { h } from 'hyperapp';

export const BasicVideoPlayer = ({ selectedFile }) => {
  if (selectedFile.type !== 'video') {
    return null;
  }

  return (
    <video key={selectedFile.name} controls autoplay crossorigin="anonymous">
      <source src={selectedFile.path} />
    </video>
  );
};

export default BasicVideoPlayer;

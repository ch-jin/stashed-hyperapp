import { h } from 'hyperapp';

export const FileList = ({ files, selectFile }) => (
  <div>
    {files.map(file => (
      <div>
        <a
          onclick={e => {
            e.preventDefault();
            selectFile(file);
          }}
          href={file.path}
        >
          {file.name}
        </a>
      </div>
    ))}
  </div>
);

export default FileList;
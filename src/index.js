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
};

const appActions = {
  fetchFile: () => state => fetch('/api/files').then(res => res.json()),
  replaceFile: files => ({ files }),
  selectFile: file => ({ selectedFile: file }),
};

const view = (state, actions) => {
  const { files, selectedFile } = state;
  const { fetchFile, replaceFile, selectFile } = actions;

  const fetchAndReceiveFile = () => fetchFile().then(data => replaceFile(data));

  return (
    <div oncreate={fetchAndReceiveFile}>
      <VideoPlayer selectedFile={selectedFile} />
      <div className="menu-container">
        <h1>Stashed</h1>
        <FileList files={files} selectFile={selectFile} />
      </div>
    </div>
  );
};

app(appState, appActions, view, document.body);

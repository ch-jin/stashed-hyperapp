import { h, app } from 'hyperapp';

const appState = {
  files: [],
};

const appActions = {
  fetchFile: () => state => fetch('/api/files').then(res => res.json()),
  replaceFile: files => ({ files }),
};

const view = (state, actions) => {
  const { files } = state;
  const { fetchFile, replaceFile } = actions;

  const fetchAndReceiveFile = () => fetchFile().then(data => replaceFile(data));

  return (
    <div>
      <h1>Stashed</h1>
      <div oncreate={fetchAndReceiveFile}>
        {files.map(file => (
          <div>
            <a href={file.pathName}>{file.fileName}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

app(appState, appActions, view, document.body);

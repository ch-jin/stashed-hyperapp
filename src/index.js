import { h, app } from 'hyperapp';

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
      {selectedFile.type === 'video' && (
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
      )}
      <div className="menu-container">
        <h1>Stashed</h1>
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
      </div>
    </div>
  );
};

app(appState, appActions, view, document.body);

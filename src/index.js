/* global hyperapp, html, hyperx */

const { h, app } = hyperapp;
const html = hyperx(h);

const appState = {
  fileNames: [],
};

const appActions = {
  fetchFileNames: () => state => fetch('/api/files').then(res => res.json()),
  replaceFileNames: fileNames => ({ fileNames }),
};

const view = (state, actions) => {
  const { fileNames } = state;
  const { fetchFileNames, replaceFileNames } = actions;

  const fetchAndReceiveFileNames = () =>
    fetchFileNames().then(data => replaceFileNames(data));

  return html`
    <div>
      <h1>Stashed</h1>
      <div oncreate=${fetchAndReceiveFileNames}>
        ${fileNames.map(fileName => html`
          <div>
            <a href=${fileName}>${fileName}</a>
          </div>
        `)}
      </div>
    </div>
  `;
};

app(appState, appActions, view, document.body);

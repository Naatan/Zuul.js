const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const client = require('electron-connect').client;

var win;

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'kitchensink.html'),
    protocol: 'file:',
    slashes: true
  }));

  client.create(win);
  win.webContents.openDevTools();

  win.on('closed', () => win = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () =>
{
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});

app.on('activate', () =>
{
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null)
    {
        createWindow()
    }
});

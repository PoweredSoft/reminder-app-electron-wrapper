const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray = null;
let iconPath = path.join(__dirname, 'tray.png');
let firstClose = true;

app.setAppUserModelId("com.poweredsoft.reminder");

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, icon: iconPath })

  tray = new Tray(iconPath);

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        win.show()
      }
    },
    {
      label: 'Quit', click: function () {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (!win.isVisible())
      win.show()
  });


  globalShortcut.register('F2', () => {
    win.webContents.openDevTools();
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/web/index.html'),
    protocol: 'file:',
    slashes: true
  }))


  win.on('show', function () {
    tray.setHighlightMode('always')
  })


  // Emitted when the window is closed.
  win.on('close', event => {
    if(!app.isQuiting){
        event.preventDefault();
        win.hide();

        if (firstClose) {
          tray.displayBalloon({ title: 'Tray', content: 'I am in your tray, right click to close.' });
          firstClose = false;
        }

        return;
    }

    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
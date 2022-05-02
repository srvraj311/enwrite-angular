"use strict";
exports.__esModule = true;
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
let win = null;
const args = process.argv[2];
console.log(args)
const serve = args === '--serve'
const ipcMain = require('electron').ipcMain;

function createWindow() {
  const electronScreen = electron_1.screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  win = new electron_1.BrowserWindow({
    x: 0,
    y: 0,
    minWidth: 550  ,
    minHeight: 768,
    width: size.width,
    height: size.height,
    frame: false,
    webPreferences: {
      devTools : false,
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    }
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();
    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200').then(r => console.log('Loaded Localhost'));
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';
    if (fs.existsSync(path.join(__dirname, '../dist/en-write-angular/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/en-write-angular/index.html';
    }
    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  win.setMenu(null);
  return win;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  electron_1.app.on('ready', function () {
    return setTimeout(createWindow, 400);
  });
  // Quit when all windows are closed.
  electron_1.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      electron_1.app.quit();
    }
  });

  ipcMain.on('close-window', () => {
    win.close();
  })
  ipcMain.on('minimize-window', () => {
    win.minimize();
  })
  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      console.log('Window is Maximized')
    } else {
      console.log('Window is not Maximized')
      win.maximize();
    }
  })

  electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

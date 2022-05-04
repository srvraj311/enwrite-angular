"use strict";
exports.__esModule = true;
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
const { app, dialog, ipcRenderer } = require("electron");
let win = null;
const args = process.argv[2];
console.log(args);
const serve = args === "--serve";
const ipcMain = require("electron").ipcMain;

app.disableHardwareAcceleration();

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("enwrite", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient("enwrite");
  }
}

function createWindow(title, content) {
  const electronScreen = electron_1.screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  win = new electron_1.BrowserWindow({
    minWidth: 550,
    minHeight: 768,
    width: 1200,
    height: 768,
    frame: false,
    icon : 'dist/en-write-angular/assets/icons/ic_launcher_round.png',
    webPreferences: {
      devTools: true,
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require("electron-debug");
    debug();
    require("electron-reloader")(module);
    win
      .loadURL("http://localhost:4200")
      .then((r) => console.log("Loaded Localhost"));
  } else {
    // Path when running electron executable
    win.setMenu(null);
    let pathIndex = "/dist/en-write-angular/index.html";
    win
      .loadURL("file://" + __dirname + pathIndex)
      .then((_) => console.log(path.join(__dirname, pathIndex)))
      .catch((e) => console.log(e));
  }
  // For protocol Windows
  const getTheLock = app.requestSingleInstanceLock();
  if (!getTheLock) app.quit();
  else {
    app.on("second-instance", (event, argv, _workingDirectory) => {
      if (win) {
        const deeplinkUrl = argv.find((arg) => {
          return arg.startsWith("enwrite://");
        });
        if (deeplinkUrl) {
          const token = deeplinkUrl.substring(10).slice(0, -1);
          win.webContents.send("auth-token", token);
        } else {
          console.log("No url recieved");
        }
        if (win.isMaximized()) win.restore();
        win.focus();
      }
    });
  }
  // For Protocol hit UNIX
  app.on("open-url", (event, url) => {
    if(url){
      const token = url.substring(10).slice(0, url.length);
      win.webContents.send("auth-token", token);
    }
  });

  // Emitted when the window is closed.
  win.on("closed", function () {
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
  electron_1.app.on("ready", function () {
    return setTimeout(createWindow, 400);
  });
  // Quit when all windows are closed.
  electron_1.app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      electron_1.app.quit();
    }
  });

  ipcMain.on("close-window", async () => {
    const ret = await dialog.showMessageBox(win, {
      title: 'Close Window',
      buttons: ['Close', 'Cancel'],
      type: 'question',
      message: 'Close Window',
      detail: `Do you want to close this window?`
    }).catch(e => console.log(e))
    if(ret.response === 0) win.close();

  });
  ipcMain.on("minimize-window", () => {
    win.minimize();
  });
  ipcMain.on("maximize-window", () => {
    if (!win.isMaximized()) {
      win.maximize();
    } else {
      console.log("Window is not Maximized");
      win.unmaximize();
    }
  });

  ipcMain.on('wait-auth', async ()=>{
    const res = await dialog.showMessageBox(win, {
      title : 'Waiting for Browser Signin',
      buttons : ['Close'],
      type : 'info',
      message : "Waiting",
      detail : "Waiting for browser to complete signup process",
      icon : 'dist/en-write-angular/assets/icons/ic_launcher_round.png'
    }).catch(e => console.log(e))
  })

  electron_1.app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
      win.maximize();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame , app, BrowserWindow, shell} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  app!: typeof app;
  shell!: typeof shell;
  browserWindow!: typeof BrowserWindow
  constructor(private userService : UserService) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.app = window.require('electron').app
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.browserWindow = window.require('electron').BrowserWindow

      this.ipcRenderer.on('auth-token',  (event , token) => {
          this.userService.signInGoogleWithPopUp(token);
      })


      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  static openUrlInBrowser(url:string){
    window.require('electron').shell.openExternal(url);
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
  close(){
    if(this.isElectron) {
      this.ipcRenderer.send('close-window')
    }
  }

  minimise(){
    if(this.isElectron) {
      this.ipcRenderer.send('minimize-window')
    }
  }
  maximise(){
    if(this.isElectron) {
      this.ipcRenderer.send('maximize-window')
    }
  }

  showWaitingMessage() {
    this.ipcRenderer.send('wait-auth')
  }
}

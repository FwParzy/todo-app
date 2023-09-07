import {app, BrowserWindow} from 'electron';
import * as path from 'path';

require('electron-reload')(path.join(__dirname, '..', 'src'), {
  electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
  hardResetMethod: 'exit'
});


let mainWindow: BrowserWindow;
app.on("ready", createWindows);

function createWindows():void {
  mainWindow = new BrowserWindow({
    width: 900, height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js"
    },
    show: false
  });

  mainWindow.loadFile("./index.html");

  mainWindow.on("ready-to-show", () => mainWindow.show())
}

import {app, BrowserWindow} from 'electron';
import { dirname } from 'path';

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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var mainWindow;
electron_1.app.on("ready", createWindows);
function createWindows() {
    mainWindow = new electron_1.BrowserWindow({
        width: 900, height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        // webPreferences: {
        //   preload: __dirname + "/preload.js"
        // },
        show: false
    });
    mainWindow.loadFile("./index.html");
    mainWindow.on("ready-to-show", function () { return mainWindow.show(); });
}

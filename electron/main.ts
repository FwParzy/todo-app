import { app, BrowserWindow, globalShortcut, screen } from 'electron'
import path from 'node:path'
import os from 'os';

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function registerGlobalShortcut(win: BrowserWindow) {
  let shortcut: string;
  if (os.platform() === 'darwin') { // macOS
    shortcut = 'Command+Shift+I';
  } else { // Windows and Linux
    shortcut = 'Alt+Shift+I';
  }

  const ret = globalShortcut.register(shortcut, () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  if (!ret) {
    console.log('registration failed');
  }
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  let windowWidth = Math.round(width * 0.33);
  let windowHeight = Math.round(height * 0.75);

  // Adjust size for Windows
  if (os.platform() === 'win32') {
    windowWidth = Math.round(width * 0.42);
    windowHeight = Math.round(height * 0.90);
  }
  if (os.platform() === 'darwin') {
    windowWidth = Math.round(width * 0.35);
    windowHeight = Math.round(height * 0.80);
  }


  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow();
  registerGlobalShortcut(); // Register the shortcut after the app is ready
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  send: <T>(channel: string, data: T) => {
    ipcRenderer.send(channel, data);
  },
  on: <T>(channel: string, callback: (data: T) => void) => {
    ipcRenderer.on(channel, (_event, arg: T) => callback(arg));
  }
});

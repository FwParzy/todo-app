import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  }
});


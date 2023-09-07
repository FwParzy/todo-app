const { contextBridge } = require('electron');
const { v4: uuidv4 } = require('uuid');

contextBridge.exposeInMainWorld('api', {
  generateUUID: () => uuidv4(),
});

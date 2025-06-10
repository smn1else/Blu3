const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setWindowPosition: (x, y) => {
    ipcRenderer.send('set-window-position', { x, y });
  },
  executeCommand: (command) => {
    ipcRenderer.send('execute-command', command);
  },
  getWindowPosition: () => ipcRenderer.invoke('get-window-position'),
  
  onUpdateMessage: (callback) => ipcRenderer.on('update-message', (_event, value) => callback(value)),
  
  sendMessage: (channel, data) => {
    let validChannels = ['toMain', 'user-input'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  onMessage: (channel, func) => {
    let validChannels = ['fromMain', 'assistant-response'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

console.log('Preload script cargado.');
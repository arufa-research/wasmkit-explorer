// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld(
  'electron', {
    invoke: (channel: string, data: any) => {
      const validChannels = [
        'startLocalNetwork',
        'downloadLocalNetwork',
        'stopLocalNetwork',
        'isDockerRunning'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
    },
  }
);

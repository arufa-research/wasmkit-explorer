import { useEffect } from 'react';
// import { ipcRenderer } from 'electron';

import {
  MAX_LOG_LENGTH,
  NEW_LOG,
} from '../utils/constants';
import { logsState } from './logsState';

const StateListeners = (): any => {
  useEffect(() => {
    (window as any).ipcRenderer.on(NEW_LOG, async (_: any, log: string) => {
      if (logsState.length >= MAX_LOG_LENGTH) {
        logsState.set((p) => p.slice(1).concat(log));
      } else {
        logsState.merge([log]);
      }
    });

    return () => {
      (window as any).ipcRenderer.removeAllListeners(NEW_LOG);
    };
  }, [
    logsState,
  ]);

  return null;
};

export default StateListeners;
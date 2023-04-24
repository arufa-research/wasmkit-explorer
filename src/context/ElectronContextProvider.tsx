import { useEffect } from 'react';

import {
  MAX_LOG_LENGTH,
  NEW_BLOCK,
  NEW_LOG,
} from '../utils/constants';
import { logsState } from './logsState';
import { blockState } from './blocksState';
import { NetworkBlockInfo } from '../types/Block';

const StateListeners = (): any => {
  useEffect(() => {
    (window as any).electron.on(NEW_BLOCK, (_: any, block: NetworkBlockInfo) => {
      blockState.latestHeight.set(Number(block.block.header.height));
      blockState.blocks.set((p) => [...p, block]);
    });

    (window as any).electron.on(NEW_LOG, async (_: any, log: string) => {
      if (logsState.length >= MAX_LOG_LENGTH) {
        logsState.set((p) => p.slice(1).concat(log));
      } else {
        logsState.merge([log]);
      }
    });

    return () => {
      (window as any).electron.removeListener(NEW_LOG);
      (window as any).electron.removeListener(NEW_BLOCK);
    };
  }, [
    logsState,
  ]);

  return null;
};

export default StateListeners;
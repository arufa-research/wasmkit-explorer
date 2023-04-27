import { useEffect } from 'react';

import {
  TX,
  NEW_LOG,
  NEW_BLOCK,
  MAX_LOG_LENGTH,
  LOCAL_NETWORK_IS_RUNNING,
} from '../utils/constants';
import { txState } from './txsState';
import { logsState } from './logsState';
import { blockState } from './blocksState';
import { NetworkTx } from '../types/Transaction';
import { NetworkBlockInfo } from '../types/Block';
import { localNetworkStarted } from './networkState';

const StateListeners = (): any => {
  useEffect(() => {
    (window as any).electron.on(NEW_BLOCK, (_: any, block: NetworkBlockInfo) => {
      blockState.latestHeight.set(Number(block.block.header.height));
      blockState.blocks.set((p) => [...p, block]);
    });

    (window as any).electron.on(TX, (_: any, tx: NetworkTx) => {
      txState.merge([{ ...tx }]);
    });

    (window as any).electron.on(NEW_LOG, async (_: any, log: string) => {
      if (logsState.length >= MAX_LOG_LENGTH) {
        logsState.set((p) => p.slice(1).concat(log));
      } else {
        logsState.merge([log]);
      }
    });

    (window as any).electron.on(
      LOCAL_NETWORK_IS_RUNNING,
      (_: any, isLocalNetworkRunning: boolean) => {
        localNetworkStarted.set(isLocalNetworkRunning);
      },
    );

    return () => {
      (window as any).electron.removeListener(TX);
      (window as any).electron.removeListener(NEW_LOG);
      (window as any).electron.removeListener(NEW_BLOCK);
      (window as any).electron.removeListener(LOCAL_NETWORK_IS_RUNNING);
    };
  }, [
    txState,
    logsState,
    blockState,
  ]);

  return null;
};

export default StateListeners;
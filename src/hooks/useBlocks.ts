import { useContext, useEffect, useState } from "react";
import { useHookstate } from '@hookstate/core';

import { TX } from "../utils/constants";
import { useNetworkConnector } from "./useNetwork";
import { blockState } from "../context/blocksState";
import { NetworkContext } from "../components/ConfigProvider";
import { INetworkHookBlockUpdate, LocalNetwork } from "../types/NetworkHook";

export function useNetworkBlockUpdate() {
  const network = useContext(NetworkContext) as LocalNetwork;
  const hookExport: INetworkHookBlockUpdate = {
    ...useNetworkConnector(),
    getBalance: async (address: string, denom: string) => {
      const coin = await network.getBalance(address, denom);
      return coin;
    },
    listenToAccountTx(address: string, cb: Function) {
      const listener = (_: any, tx: any) => {
        const { from_address: add } = tx.msg;
        if (add === address) {
          cb(add);
        }
      };
      (window as any).electron.on(TX, listener);
      return () => {
        (window as any).electron.removeListener(TX, listener);
      };
    },
  };

  return hookExport;
}

export const useBlocks = () => useHookstate(blockState);

export const useGetLatestHeight = () => {
  const blocks = useBlocks();
  const { latestHeight } = blocks.get();
  return latestHeight || 0;
};

export function useGetTxFromHeight(height?: number) {
  const network = useContext(NetworkContext) as LocalNetwork;
  const [txInfo, setInfo] = useState([]);
  useEffect(() => {
    network.getTxnInfoByHeight(height).then((tx) => {
      setInfo(tx as never[]);
    });
  }, []);

  return txInfo;
};

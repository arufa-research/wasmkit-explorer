import { useContext, useEffect, useState } from "react";
import { useHookstate } from '@hookstate/core';
import { LocalTerra } from '@terra-money/terra.js';

import { TX } from "../utils/constants";
import { useNetwork } from "./useNetwork";
import { blockState } from "../context/blocksState";
import { NetworkContext } from "../components/ConfigProvider";
import { INetworkHookBlockUpdate } from "../types/NetworkHook";

export function useNetworkBlockUpdate() {
  const network = useContext(NetworkContext) as LocalTerra;
  const hookExport: INetworkHookBlockUpdate = {
    ...useNetwork(),
    getBalance: async (address: string) => {
      const [coins] = await network.bank.balance(address);
      return coins.toData();
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
  const terra = useContext(NetworkContext) as LocalTerra;
  const [txInfo, setInfo] = useState([]);
  useEffect(() => {
    terra.tx.txInfosByHeight(height).then((tx) => {
      setInfo(tx as never[]);
    });
  }, []);

  return txInfo;
};

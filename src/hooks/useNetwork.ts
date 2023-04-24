import { useContext } from "react";
import { LocalTerra, Wallet } from '@terra-money/terra.js';

import { INetworkHook } from "../types/NetworkHook";
import { NetworkContext } from "../components/ConfigProvider";

export function useNetwork() {
  const network = useContext(NetworkContext) as LocalTerra;
  const hook: INetworkHook = {
    network,
    wallets: network.wallets,
    getTestAccounts(): Wallet[] {
      return Object.values(network.wallets);
    },
  };
  return hook;
}

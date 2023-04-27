import { useContext } from "react";
import { useHookstate } from "@hookstate/core";
import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import { IConnectorHook, INetworkHook, LocalNetwork } from "../types/NetworkHook";
import { NetworkContext } from "../components/ConfigProvider";
import { localNetworkStarted } from "../context/networkState";

export function useNetworkConnector() {
  const localNetwork = useContext(NetworkContext) as LocalNetwork;
  const hook: IConnectorHook = {
    // client: SigningCosmWasmClient.connectWithSigner(
    //   'http://localhost:1317',
    // ),
    // queryClient: CosmWasmClient.connect(
    //   'http://localhost:1317',
    // ),
    network: localNetwork,
    getTestAccounts(): any[] {
      return localNetwork.getTestAccounts();
    },
  };
  return hook;
}

export const useLocalNetworkStarted = () => useHookstate(localNetworkStarted);

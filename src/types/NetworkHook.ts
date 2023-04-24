import { Coins, LCDClient, Wallet } from '@terra-money/terra.js';

export interface INetworkHook {
  network: LCDClient,
  wallets: { [key: string]: Wallet },
  getTestAccounts(): Wallet[]
}

export interface INetworkHookBlockUpdate extends INetworkHook{
  getBalance(address : string): Promise<Coins.Data>
  listenToAccountTx(address : string, cb : Function) : any
}

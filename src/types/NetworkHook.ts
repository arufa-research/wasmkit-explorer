import { Coin } from '@cosmjs/stargate';
import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";

export interface IConnectorHook {
  // client: Promise<SigningCosmWasmClient>,
  // queryClient: Promise<CosmWasmClient>,
  network: LocalNetwork,

  getTestAccounts(): any[],
  // getTestAccounts(): SigningCosmWasmClient[],
  // query(queryMsg: any, contractAddress: string): Promise<any>,
  // execute(executeMsg: any, contractAddress: string): Promise<any>,
}

export interface INetworkHook {
  network: CosmWasmClient,
  wallets: { [key: string]: SigningCosmWasmClient },
  // getTestAccounts(): SigningCosmWasmClient[]
}

export interface INetworkHookBlockUpdate extends IConnectorHook{
  getBalance(address : string, denom: string): Promise<Coin>
  listenToAccountTx(address : string, cb : Function) : any
}

export interface LocalNetworkConfig {
  /**
   * The base URL to which LCD requests will be made.
   */
  URL: string;
  RPC_URL: string;
  /**
   * Chain ID of the blockchain to connect to.
   */
  chainID: string;
}

export class LocalNetwork {
  config: LocalNetworkConfig = {
    URL: 'http://localhost:1317/',
    RPC_URL: 'http://localhost:26657/',
    chainID: 'testing-1'
  };
  wallets: Record<string, string> = {
  'neutron1m9l358xunhhwds0568za49mzhvuxx9ux8xafx2': 'banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass',
  };

  constructor() {

  };

  getTestAccounts(): any {
    return [{
      accAddress: 'neutron1m9l358xunhhwds0568za49mzhvuxx9ux8xafx2',
      mnemonic: this.wallets['neutron1m9l358xunhhwds0568za49mzhvuxx9ux8xafx2'],
    }];
  }

  async getTxnInfoByHeight(height: number): Promise<any> {
    const queryClient = await CosmWasmClient.connect(
      this.config.RPC_URL,
    );

    const blockInfo = await queryClient.getBlock(height);
    return blockInfo.txs;
  }

  async query(queryMsg: any, contractAddress: string): Promise<any> {
    const queryClient = await CosmWasmClient.connect(
      this.config.RPC_URL,
    );
    const queryResponse = await queryClient.queryContractSmart(
      contractAddress,
      queryMsg,
    );

    // queryClient.get

    return queryResponse;
  };

  async getBalance(address: string, denom: string): Promise<Coin> {
    const queryClient = await CosmWasmClient.connect(
      this.config.RPC_URL,
    );
    const balanceResponse = await queryClient.getBalance(
      address,
      denom,
    );
    console.log("balanceResponse: ", balanceResponse);

    return balanceResponse;
  }

  async execute(executeMsg: any, contractAddress: string): Promise<any> {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      this.wallets['neutron1m9l358xunhhwds0568za49mzhvuxx9ux8xafx2'],
      {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "neutron"
      }
    );
    const client = await SigningCosmWasmClient.connectWithSigner(
      this.config.RPC_URL,
      wallet,
    );

    const exeuteResponse = await client.execute(
      'neutron1m9l358xunhhwds0568za49mzhvuxx9ux8xafx2',
      contractAddress,
      executeMsg,
      {
        amount: [{ amount: "300000", denom: "untrn" }],
        gas: "500000"
      },
      undefined,
      []
    );
    return exeuteResponse;
  };

}


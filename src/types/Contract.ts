export interface SmartContract {
  name: string;
  path: string;
  address: string;
  codeId: number;
  schemas: any[] | null;
}

export type ContractViewProps = {
  data: SmartContract;
  selectedWallet: string;
  handleDeleteContract: Function;
  handleQuery: Function;
  handleExecute: Function;
  handleRefreshRefs: Function;
}

export interface NetworkContract {
  name: string;
  address: string;
  codeId: number;
  creator: string;
  // schemas: any[] | null;
}

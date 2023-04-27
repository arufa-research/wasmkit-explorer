import { Tooltip } from '@mui/material';
import { Virtuoso } from 'react-virtuoso';
// import { FaPlus } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

import {
  IMPORT_SAVED_CONTRACTS,
  IMPORT_NEW_CONTRACTS,
  DELETE_CONTRACT,
  REFRESH_CONTRACT_REFS,
  IMPORT_DEPLOYED_CONTRACTS,
} from '../utils/constants';
import { useNetworkConnector } from '../hooks/useNetwork';
import SelectWallet from '../components/Selectwallet';
import ContractView from '../components/ContractView';
import LinearLoad from '../components/LinearLoad';
import { NetworkContract } from '../types/Contract';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getTestAccounts } = useNetworkConnector();
  const wallets = getTestAccounts();
  const [selectedWallet, setSelectedWallet] = useState('validator');

  const wallet = wallets[0];

  const gridTemplateColumns = 'minmax(175px, max-content) minmax(100px, 1fr) 2.5fr 150px';

  useEffect(() => {
    const cachedWallet = window.localStorage.getItem('prevWalletSelection');
    if (cachedWallet) setSelectedWallet(cachedWallet);
    importSavedContracts();
    importDeployedContracts();
  }, []);

  const handleNewContractsImport = async () => {
    const newContracts = await (window as any).electron.invoke(IMPORT_NEW_CONTRACTS);
    setContracts(newContracts);
  };

  const handleDeleteContract = async (
    codeId: string,
    e: React.MouseEvent<HTMLElement>,
  ) => {
    e.stopPropagation();
    const updContracts = await (window as any).electron.invoke(DELETE_CONTRACT, codeId);
    setContracts(updContracts);
  };

  const handleRefreshRefs = async (
    path: string,
    e: React.MouseEvent<HTMLElement>,
  ) => {
    e.stopPropagation();
    const updContracts = await (window as any).electron.invoke(REFRESH_CONTRACT_REFS, path);
    setContracts(updContracts);
  };

  const importSavedContracts = async () => {
    const savedContracts = await (window as any).electron.invoke(IMPORT_SAVED_CONTRACTS);
    setContracts(savedContracts);
  };

  const importDeployedContracts = async () => {
    const depolyedContracts: NetworkContract[] = await (window as any).electron.invoke(IMPORT_DEPLOYED_CONTRACTS);
    console.log("depolyedContracts: ", depolyedContracts);
    setContracts(depolyedContracts);
  };

  const handleWalletChange = (event: SelectChangeEvent) => {
    setSelectedWallet(event.target.value);
    window.localStorage.setItem('prevWalletSelection', event.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full text-left items-center px-4 py-5 gap-4">
        <SelectWallet
          selectedWallet={selectedWallet}
          handleWalletChange={handleWalletChange}
        />

        <Tooltip title="import a Terrain project directory to access contract methods">
          <button
            type="button"
            onClick={handleNewContractsImport}
            className="main-button tour__add-contracts flex items-center h-8 gap-2 px-5 rounded-3xl text-white font-medium text-sm bg-terra-button-primary hover:bg-[#0f40b9]"
          >
            {/* <FaPlus className="flex-none w-2.5 text-white" /> */}
            Add Contracts
          </button>
        </Tooltip>
      </div>
      {isLoading && <LinearLoad />}
      <div
        className="bg-white grid items-center w-full px-10 py-5 text-terra-text-muted font-medium text-sm uppercase z-30 border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
      >
        <div>Name</div>
        <div>Code ID</div>
        <div>Address</div>
        <div />
      </div>
      {contracts && (
        <Virtuoso
          followOutput
          className="flex flex-col w-full scrollbar"
          style={{ overflow: 'overlay' }}
          data={contracts}
          itemContent={(index, data) => (
            <ContractView
              handleDeleteContract={handleDeleteContract}
              handleRefreshRefs={handleRefreshRefs}
              data={data}
              key={index}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              wallet={wallet}
              gridTemplateColumns={gridTemplateColumns}
            />
          )}
        />
      )}
    </div>
  );
}

export default React.memo(ContractsPage);

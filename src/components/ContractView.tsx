import { Collapse } from '@mui/material';
import { useTour } from '@reactour/tour';
import { Wallet } from '@terra-money/terra.js';
import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

import { truncate } from '../utils/common';
import { NetworkContract, SmartContract } from '../types/Contract';
import TextCopyButton from './TextCopyButton';
import ContractMethodsView from './ContractMethodsView';
import { REACT_APP_FINDER_URL } from '../utils/constants';
// import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';
// import { ReactComponent as TrashIcon } from '../../assets/icons/trash.svg';
// import { ReactComponent as RefreshIcon } from '../../assets/icons/refresh.svg';

const ContractView = ({
  handleDeleteContract,
  handleRefreshRefs,
  data,
  gridTemplateColumns,
  wallet,
  setIsLoading,
  isLoading,
}: {
  data: NetworkContract; // TODO: update to contract struct
  handleDeleteContract: Function;
  handleRefreshRefs: Function;
  gridTemplateColumns: string;
  setIsLoading: Function;
  isLoading: boolean;
  wallet: Wallet;
}) => {
  const {
    name, codeId, address, creator
  } = data;

  const schemas = [{}];
  const path = "";

  const [open, setOpen] = useState(false);
  const toggleContractRow = () => setOpen(!open);
  const { isOpen, currentStep } = useTour();

  useEffect(() => {
    if (isOpen && currentStep >= 10) setOpen(true);
  }, [currentStep]);

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        className="cursor-pointer tour__contract-view px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
        onClick={toggleContractRow}
      >
        <a
          className="flex items-center text-terra-link hover:underline"
          target="_blank"
          href={`${REACT_APP_FINDER_URL}/address/${address}`}
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-ellipsis overflow-hidden">{name}</div>
          <div className="ml-1.5">
            {/* <ExternalLinkIcon className="fill-terra-link" /> */}
          </div>
        </a>
        <div className="flex">{codeId}</div>
        <div className="flex flex-row center-items">
          <div className="">{truncate(address, [10, 10])}</div>
          <TextCopyButton className="ml-1 mb-2" text={address} />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => handleDeleteContract(codeId, e)}
            className="text-blue"
          >
            {/* <TrashIcon className="text-blue mr-5" /> */}
          </button>
          <button
            type="button"
            onClick={(e) => handleRefreshRefs(path, e)}
            className="text-blue"
          >
            {/* <RefreshIcon className="text-blue" /> */}
          </button>
          {schemas && (
            <div className="ml-10">
              <KeyboardArrowDownIcon
                className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white">
        <Collapse
          in={open}
          timeout="auto"
          className={open ? 'px-20 py-7' : 'hidden'}
        >
          <ContractMethodsView
            schemas={schemas}
            setIsLoading={setIsLoading}
            address={address}
            wallet={wallet}
            isLoading={isLoading}
          />
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(ContractView);

import React, { useEffect, useState } from 'react';

import KeyViewModal from './KeyViewMadal';
import TextCopyButton from './TextCopyButton';
import { demicrofy, nFormatter } from '../utils/common';
import { REACT_APP_FINDER_URL } from '../utils/constants';
import { useNetworkBlockUpdate } from '../hooks/useBlocks';
import { useLocalNetworkStarted } from '../hooks/useNetwork';
import { Coin } from '@cosmjs/stargate';
// import { ReactComponent as KeyIcon } from '../../assets/icons/key.svg';
// import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';

function AccountView({
  wallet,
  handleToggleClose,
  handleToggleOpen,
  gridTemplateColumns,
}: {
  wallet: any;
  handleToggleClose: Function;
  handleToggleOpen: Function;
  gridTemplateColumns: string;
}) {
  const { accAddress, mnemonic } = wallet;
  const [balance, setBalance] = useState(0.0);
  const { getBalance } = useNetworkBlockUpdate();
  const hasStartedLocalNetwork = useLocalNetworkStarted();
  const denom = 'ujunox';

  useEffect(() => {
    if (!hasStartedLocalNetwork.get()) return;
    getBalance(accAddress, denom).then((coin: Coin) => {
      setBalance(demicrofy(Number(coin.amount)));
    });
  }, [hasStartedLocalNetwork]);

  return (
    <div
      role="row"
      tabIndex={0}
      className="px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
      style={{ gridTemplateColumns }}
    >
      <div className="flex flex-row">
        <a
          href={`${REACT_APP_FINDER_URL}/address/${accAddress}`}
          target="_blank"
          className="flex items-center text-terra-link hover:underline"
          rel="noreferrer"
        >
          <p>{accAddress}</p>
          {/* <ExternalLinkIcon className="fill-terra-link mx-1" /> */}
        </a>
      </div>
      <TextCopyButton text={accAddress} classes="flex" />
      <p>{nFormatter(balance)}</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleToggleOpen(
            <KeyViewModal
              mnemonic={mnemonic}
              handleClose={handleToggleClose}
            />,
          )}
        >
          {/* <KeyIcon className="h-6 w-6 fill-terra-text hover:fill-terra-button-primary" /> */}
        </button>
      </div>
    </div>
  );
}

export default React.memo(AccountView);

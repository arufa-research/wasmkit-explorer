import * as React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

import { truncate } from '../utils/common';
import TextCopyButton from './TextCopyButton';
import { useNetworkConnector } from '../hooks/useNetwork';

const SelectWallet = (
  { handleWalletChange, selectedWallet }: { handleWalletChange: any, selectedWallet: string }
) => {
  const { getTestAccounts } = useNetworkConnector();
  const wallets = getTestAccounts();
  return (
    <FormControl sx={{ minWidth: 280 }} size="medium" className="custom-select">
      <Select
        label="wallet"
        value={selectedWallet}
        onChange={handleWalletChange}
        className="font-gotham text-terra-text text-sm bg-white rounded-lg"
        classes={{ select: 'rounded-lg leading-[21px] py-3.5 pr-8 pl-3' }}
      >
        {Object.keys(wallets).map((name: any) => (
          <MenuItem key={name} value={name} classes={{ root: 'justify-between' }}>
            {name}
            {'        '}
            {truncate(wallets[name].accAddress, [0, 8])}
            {name !== selectedWallet && <TextCopyButton text={wallets[name].accAddress} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectWallet);

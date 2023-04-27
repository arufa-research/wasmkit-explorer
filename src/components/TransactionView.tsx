import React from 'react';
import { Collapse } from '@mui/material';
import { ImmutableObject } from '@hookstate/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import EventInfo from './EventInfo';
import { truncate } from '../utils/common';
import TextCopyButton from './TextCopyButton';
import { NetworkTx } from '../types/Transaction';
import { REACT_APP_FINDER_URL } from '../utils/constants';
// import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';

const TransactionView = ({
  data,
  index,
  onToggleEventDetails,
  gridTemplateColumns,
}: {
  data: ImmutableObject<NetworkTx>;
  index: number;
  gridTemplateColumns: string;
  onToggleEventDetails: (_index: number) => void;
}) => {
  const { txhash, result, height } = data.TxResult;
  const txHref = `${REACT_APP_FINDER_URL}/tx/${txhash}`;

  const [open, setOpen] = React.useState(data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open);
    onToggleEventDetails(index);
  };

  const percentGasUsed = 100 * (Number(result.gas_used) / Number(result.gas_wanted));

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        className="cursor-pointer px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
        onClick={toggleEventsRow}
      >
        <div className="flex">
          <a
            className="pointer-events-none flex items-center justify-around text-terra-link hover:underline"
            target="_blank"
            href={txHref}
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <div>{truncate(txhash, [5, 5])}</div>
            {/* <ExternalLinkIcon className="fill-terra-link mx-1" /> */}
          </a>
        </div>
        <TextCopyButton text={txhash} classes="flex" />
        <div>{data.msg['@type'].split('.').slice(-1)}</div>
        <div>{height}</div>
        <div className="flex items-center">
          {result.gas_wanted}
          {' '}
          /
          {' '}
          {result.gas_used}
          {' '}
          (
          {percentGasUsed.toFixed(2)}
          %)
        </div>
        <div className="flex justify-end">
          <KeyboardArrowDownIcon className={open ? 'rotate-180' : 'rotate-0'} />
        </div>
      </div>

      <div className="bg-white">
        <Collapse in={open} timeout="auto" unmountOnExit className="px-20 py-7">
          <EventInfo title="Events" events={result.events} />
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(TransactionView);

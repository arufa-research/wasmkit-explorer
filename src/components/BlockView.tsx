import React from 'react';
import { Collapse } from '@mui/material';
import { ImmutableObject } from '@hookstate/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// import { REACT_APP_FINDER_URL } from '../../public/constants';
// import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';

import EventInfo from './EventInfo';
import { NetworkBlockInfo } from '../types/Block';
import { useGetTxFromHeight } from '../hooks/useBlocks';

const BlockView = (props: {
  data: ImmutableObject<NetworkBlockInfo>;
  index: number;
  gridTemplateColumns: string;
  onToggleEventDetails: (index: number) => void;
}) => {
  const { height, time } = props.data.block.header;
  const { result_begin_block, hasEventsOpenInUi } = props.data;
  const { gridTemplateColumns } = props;
  // const blockHref = `${REACT_APP_FINDER_URL}/blocks/${height}`;
  const txInfos = useGetTxFromHeight(parseInt(height, 10));

  const dateString = `${new Date(time).toDateString()} | ${new Date(
    time,
  ).toLocaleTimeString()}`;

  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => {
    gasUsed += gas;
  });

  const toggleBlocksRow = () => {
    props.onToggleEventDetails(props.index);
  };

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        className="cursor-pointer px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
        onClick={toggleBlocksRow}
      >
        <a
          href={"https:/kdjhfjdhfjd"}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-none flex items-center text-terra-link hover:underline"
          rel="noreferrer"
        >
          <div>{height}</div>
          {/* <ExternalLinkIcon className="fill-terra-link mx-1" /> */}
        </a>

        <div>{dateString}</div>
        <div>{txInfos.length}</div>
        <div>{gasUsed}</div>
        <div className="flex justify-end">
          <KeyboardArrowDownIcon
            className={`cursor-pointer ${hasEventsOpenInUi ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>
      <div className="bg-white">
        <Collapse in={hasEventsOpenInUi} timeout="auto" unmountOnExit className="px-20 py-7">
          <EventInfo
            title="Begin block event"
            events={result_begin_block.events}
          />
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(BlockView);

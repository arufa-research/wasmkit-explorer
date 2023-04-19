import React from 'react';
import { Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// import EventInfo from './EventInfo';
// import { TerrariumBlockInfo } from '../models';
// import { useGetTxFromHeight } from '../hooks/terra';
// import { REACT_APP_FINDER_URL } from '../../public/constants';
// import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';

// import { BlockInfo } from '@terra-money/terra.js';

export interface Event {
  attributes: EventAttribute[];
  type: string;
}

export interface EventAttribute {
  key: string;
  value: string;
  index: boolean;
}

export interface TerrariumBlocks {
  blocks: TerrariumBlockInfo[]
  latestHeight: number
}

export interface TerrariumBlockInfo {
  block_id: BlockID;
  block: Block;
  result_begin_block: {
    events: Event[]
  },
  result_end_block: {
    events: Event[]
  },
  hasEventsOpenInUi?: boolean;
}

export interface BlockInfo {
  block_id: BlockID;
  block: Block;
}
export interface Block {
  header: Header;
  data: {
      txs: string[] | null;
  };
  evidence: Evidence;
  last_commit: LastCommit;
}
export interface Evidence {
  evidence: string[];
}
export interface Header {
  version: Version;
  /** blockchain ID */
  chain_id: string;
  /** block's height */
  height: string;
  /** time the block was included */
  time: string;
  last_block_id: BlockID;
  last_commit_hash: string;
  data_hash: string;
  validators_hash: string;
  next_validators_hash: string;
  consensus_hash: string;
  app_hash: string;
  last_results_hash: string;
  evidence_hash: string;
  proposer_address: string;
}
export interface BlockID {
  hash: string;
  part_set_header: Parts;
}
export interface Parts {
  total: string;
  hash: string;
}
export interface Version {
  block: string;
  app: string;
}
export interface LastCommit {
  height: string;
  round: number;
  block_id: BlockID;
  signatures: Signature[];
}
export interface Signature {
  block_id_flag: number;
  validator_address: string;
  timestamp: string;
  signature: string;
}

const BlockView = (props: {
  data: TerrariumBlockInfo;
  index: number;
  gridTemplateColumns: string;
  onToggleEventDetails: (index: number) => void;
}) => {
  // const { height, time } = props.data.block.header;
  const height = 232323;
  const { result_begin_block, hasEventsOpenInUi } = props.data;
  const { gridTemplateColumns } = props;
  // const blockHref = `${REACT_APP_FINDER_URL}/blocks/${height}`;
  // const txInfos = useGetTxFromHeight(parseInt(height, 10));

  // TODO: add actual date later
  const dateString = `${new Date().toDateString()} | ${new Date(
  ).toLocaleTimeString()}`;

  let gasUsed: number = 0;
  // txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => {
  //   gasUsed += gas;
  // });

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
        <div>{"43y483"}</div>
        <div>{gasUsed}</div>
        <div className="flex justify-end">
          <KeyboardArrowDownIcon
            className={`cursor-pointer ${hasEventsOpenInUi ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>
      {/* <div className="bg-white">
        <Collapse in={hasEventsOpenInUi} timeout="auto" unmountOnExit className="px-20 py-7">
          <EventInfo
            title="Begin block event"
            events={result_begin_block.events}
          />
        </Collapse>
      </div> */}
    </div>
  );
};

export default React.memo(BlockView);

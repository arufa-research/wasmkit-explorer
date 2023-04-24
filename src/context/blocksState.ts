import { hookstate } from '@hookstate/core';

import { NetworkBlocks } from '../types/Block';

export const blockState = hookstate<NetworkBlocks>({
  blocks: [],
  latestHeight: 0,
});

import { hookstate } from '@hookstate/core';

import { NetworkTx } from '../types/Transaction';

export const txState = hookstate<NetworkTx[]>([]);

import { hookstate } from '@hookstate/core';

import { NetworkContract } from '../types/Contract';

export const contractState = hookstate<NetworkContract[]>([]);

import { useHookstate } from '@hookstate/core';
import { txState } from '../context/txsState';

export const useTxs = () => useHookstate(txState);

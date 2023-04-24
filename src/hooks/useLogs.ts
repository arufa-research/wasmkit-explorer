import { useHookstate } from '@hookstate/core';
import { logsState } from '../context/logsState';

export const useGetLogs = () => useHookstate(logsState).get();

import { Virtuoso } from 'react-virtuoso';

import LogItemView from '../components/LogView';
import { useGetLogs } from '../hooks/useLogs';

export default function LogsPage() {
  const logs = useGetLogs();

  return (
    <div className="pl-4 w-full">
      <Virtuoso
        className="flex flex-col w-full scrollbar"
        initialTopMostItemIndex={logs.length}
        data={logs}
        itemContent={(index, log) => <LogItemView key={index} log={log} />}
      />
    </div>
  );
}

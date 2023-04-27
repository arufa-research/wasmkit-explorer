import { useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useTxs } from '../hooks/useTxs';
import TransactionView from '../components/TransactionView';

export default function TransactionsPage() {
  const txs = useTxs();
  const data = txs.value;

  const gridTemplateColumns = '150px 50px minmax(275px, 1fr) 100px minmax(100px, 1fr) 50px';

  if (txs.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <h1 className="text-xl font-bold text-terra-text uppercase">
          There are no transactions yet.
        </h1>
      </div>
    );
  }

  const toggleEventDetails = useCallback((index: number) => {
    txs.set(
      txs => {txs[index].hasEventsOpenInUi = !txs[index].hasEventsOpenInUi; return txs;}
    );
  }, [data]);

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white grid items-center w-full px-10 py-5 text-terra-text-muted font-medium text-sm uppercase z-30 border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
      >
        <div>Hash</div>
        <div />
        <div>Type</div>
        <div>Block</div>
        <div>Gas Used</div>
      </div>
      <Virtuoso
        followOutput
        className="flex flex-col w-full scrollbar"
        style={{ overflow: 'overlay' }}
        data={data}
        itemContent={(index, transaction) => (
          <TransactionView
            onToggleEventDetails={toggleEventDetails}
            data={transaction}
            key={index}
            index={index}
            gridTemplateColumns={gridTemplateColumns}
          />
        )}
      />
    </div>
  );
}

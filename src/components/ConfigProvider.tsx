import React from 'react';

import { INetworkConfig } from '../types/NetworkConfig';
import { LocalNetwork } from '../types/NetworkHook';

export const NetworkContext = React.createContext({});

const defaultConfig: INetworkConfig = {
  url: 'http://localhost:1317',
  chainId: 'localterra',
};

const Provider = ({ children, config }: { children: any, config?: INetworkConfig }) => {
  // TODO: Replace LocalTerra with a generalised wrapped over LCDClient
  const localConfig = React.useMemo(() => new LocalNetwork(), [config]);
  return (
    <NetworkContext.Provider value={localConfig}>
      {children}
    </NetworkContext.Provider>
  );
};

Provider.defaultProps = { config: defaultConfig };

export default Provider;

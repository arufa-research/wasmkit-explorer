import os from 'os';
import fs from 'fs';
import util from 'util';
import path from 'path';
import yaml from 'js-yaml';
import waitOn from 'wait-on';
import { app } from 'electron';
import { spawn, execSync } from 'child_process';
import { WebSocketClient } from '@terra-money/terra.js';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

// import {
//   showLocalNetworkStartNotif,
//   showMemoryOveruseDialog,
//   showLocalNetworkStopNotif,
//   showTxOccuredNotif,
//   showCustomDialog,
// } from './messages';
// import { store } from './store';
import { setDockIconDisplay, parseTxDescriptionAndMsg } from '../utils';
import { localNetworkState } from '../globals';
// import exec = util.promisify('child_process').exec);

import {
  LOCAL_NETWORK_GIT,
  LOCAL_NETWORK_CFG,
  LOCAL_NETWORK_WS,
  LOCAL_NETWORK_IS_RUNNING,
  LOCAL_NETWORK_PATH_CONFIGURED,
  NEW_LOG,
  MEM_USE_THRESHOLD_MB,
  NEW_BLOCK,
  TX,
} from '../../utils/constants';
import { NetworkContract } from '../../types/Contract';

let txWs = new WebSocketClient(LOCAL_NETWORK_WS);
let blockWs = new WebSocketClient(LOCAL_NETWORK_WS);

// const validateLocalNetworkPath = (url) => {
//   try {
//     const dockerComposePath = path.join(url, 'docker-compose.yml');
//     const dockerComposeYml = fs.readFileSync(dockerComposePath, 'utf8');
//     const { services } = yaml.load(dockerComposeYml);
//     const ltServices = Object.keys(services);
//     return ltServices.includes('terrad');
//   } catch (e) {
//     return false;
//   }
// };

export const downloadLocalNetwork = async (startNetwork: boolean) => {
  // TODO: generalise to any cosmos chain
  const localNetworkPath = path.join(app.getPath('appData'), 'juno');
  if (fs.existsSync(localNetworkPath)) {
    throw Error(`LocalNetwork already exists under the path '${localNetworkPath}'`);
  } else {
    execSync(`git clone ${LOCAL_NETWORK_GIT} --depth 1`, {
      cwd: app.getPath('appData'),
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`,
      },
    });
    if (startNetwork) {
      await startLocalNetwork(localNetworkPath);
    }
  }
  return localNetworkPath;
};

export const startMemMonitor = () => {
  setInterval(() => {
    if (os.freemem() < MEM_USE_THRESHOLD_MB) {
      console.error("Memory used threshold breached")
      // showMemoryOveruseDialog();
    }
  }, 10000);
};

export const startLocalNetwork = async (localNetworkName: string) => {
  // const liteMode = await store.getLiteMode();

  try {
    const isContainerRunning = execSync(`docker ps | grep ${localNetworkName}`);
    console.log("isContainerRunning: ", isContainerRunning);
  } catch {
    try {
      execSync(
        `
        docker run -d --name ${localNetworkName} -p 1317:1317 -p 26656:26656 -p 26657:26657 -p 16657:16657 -p 8090:9090 -e RUN_BACKGROUND=0 uditgulati0/${localNetworkName}:latest
        `,
        {
          env: {
            PATH: `${process.env.PATH}:/usr/local/bin/`,
          },
        },
      );
    } catch {
      execSync(
        `
        docker start ${localNetworkName}
        `,
        {
          env: {
            PATH: `${process.env.PATH}:/usr/local/bin/`,
          },
        },
      );
    }
  }
  return waitOn({ resources: ['http://localhost:26657'] });
};

export const subscribeToLocalNetworkEvents = async (win: any, localNetworkName: string) => {
  // TODO: fetch it from user
  const liteMode = false;

  const localNetworkProcess = spawn(
    'docker',
    ['logs', `${localNetworkName}`, '-f'],
    {
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`,
      },
    },
  );

  txWs = new WebSocketClient(LOCAL_NETWORK_WS);
  blockWs = new WebSocketClient(LOCAL_NETWORK_WS);

  localNetworkProcess.stdout.on('data', async (data) => {
    try {
      if (win && win.isDestroyed && win.isDestroyed()) { return; }
      win.webContents.send(NEW_LOG, data.toString());

      if (!localNetworkState.isRunning) {
        txWs.subscribeTx({}, async ({ value }) => {
          const { description, msg } = parseTxDescriptionAndMsg(
            value.TxResult.tx,
          );
          win.webContents.send(TX, { description, msg, ...value });
          // showTxOccuredNotif(description);
        });

        blockWs.subscribe(NEW_BLOCK, {}, ({ value }) => {
          win.webContents.send(NEW_BLOCK, value);
        });

        txWs.start();
        blockWs.start();

        localNetworkState.isRunning = true;
        win.webContents.send(LOCAL_NETWORK_IS_RUNNING, true);
        win.webContents.send(LOCAL_NETWORK_PATH_CONFIGURED, true);
        // showLocalNetworkStartNotif();
      }
    } catch (err) {
      console.error(`Error with stdout data: ${err}`); // eslint-disable-line no-console
    }
  });

  localNetworkProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`); // eslint-disable-line no-console
  });

  localNetworkProcess.on('close', () => {
    try {
      if (win && win.isDestroyed && win.isDestroyed()) { return; }
      localNetworkState.isRunning = false;
      win.webContents.send(LOCAL_NETWORK_IS_RUNNING, false);
    } catch (err) {
      console.error(`Error closing LocalNetwork process: ${err}`); // eslint-disable-line no-console
    }
  });
  return localNetworkProcess;
};

// TODO: use path type instead of string to 
// make it platform agnostic (should work on windows, linux and mac)
export const stopLocalNetwork = async (localNetworkName: string) => {
  try {
    txWs.destroy();
    blockWs.destroy();

    execSync(`docker stop ${localNetworkName}`, {
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`, // TODO: this is a hack, find a better way to do this
      },
    });

    // localNetworkState.isRunning = false;
    // showLocalNetworkStopNotif();
  } catch (err) {
    console.log('Network stop failed: ', err);
    // await showCustomDialog(JSON.stringify(err));
  }
};

// export const shutdown = async (win: any, restart = false) => {
//   setTimeout(() => {
//     // Force shutdown after 20 seconds.
//     app.exit();
//   }, 20000);

//   try {
//     win.hide();
//     // setDockIconDisplay(false, win);
//     // app.isQuitting = true;
//     // await stopLocalNetwork();
//     if (restart) app.relaunch();
//     app.exit();
//   } catch (err) {
//     app.exit();
//   }
// };

export const isDockerRunning = async () => {
  try {
    execSync('docker ps', {
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`,
      },
    });
    return true;
  } catch (err) {
    if (JSON.stringify(err).includes('Cannot connect to the Docker daemon')) {
      return false;
    }
    // await showCustomDialog(JSON.stringify(err));
  }
};

export const importDeployedContracts = async () => {
  const queryClient = await CosmWasmClient.connect(
    'http://localhost:26657'
  );

  // fetch all codeIds on network
  let codeIds = await queryClient.getCodes();

  // fetch contract addresses for each codeId
  let allAddresses: string[] = [];
  for (const codeId of codeIds) {
    const addresses = await queryClient.getContracts(codeId.id);
    allAddresses = allAddresses.concat(addresses);
  }

  let allContracts: NetworkContract[] = [];
  for (const address of allAddresses) {
    const contractDetails = await queryClient.getContract(address);
    allContracts.push({
      name: contractDetails.label,
      address: contractDetails.address,
      codeId: contractDetails.codeId,
      creator: contractDetails.creator,
    })
  }
  return allContracts;
};

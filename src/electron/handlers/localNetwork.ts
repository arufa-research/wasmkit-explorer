import os from 'os';
import fs from 'fs';
import util from 'util';
import path from 'path';
import yaml from 'js-yaml';
import waitOn from 'wait-on';
import { app } from 'electron';
import { spawn, execSync } from 'child_process';
import { WebSocketClient } from '@terra-money/terra.js';

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
  // console.log("localNetworkPath: ", localNetworkPath);
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

export const startLocalNetwork = async (localNetworkPath: string) => {
  // const liteMode = await store.getLiteMode();
  const liteMode = false;
  execSync(
    `${LOCAL_NETWORK_CFG} docker-compose up ${liteMode ? 'junod' : ''} -d --wait --remove-orphans`,
    {
      cwd: localNetworkPath,
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`,
      },
    },
  );
  return waitOn({ resources: ['http://localhost:26657'] });
};

export const subscribeToLocalNetworkEvents = async (win: any, localNetworkPath: string) => {
  // const [localNetworkPath, liteMode] = await Promise.all([
  //   store.getLocalNetworkPath(),
  //   store.getLiteMode(),
  // ]);

  // TODO: fetch it from user
  const liteMode = false;

  const localNetworkProcess = spawn(
    'docker',
    ['compose', 'logs', ...(liteMode ? ['terrad'] : []), '-f'],
    {
      cwd: localNetworkPath,
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
export const stopLocalNetwork = async (localNetworkPath: string) => {
  try {
    // const localNetworkPath = await store.getLocalNetworkPath();
    txWs.destroy();
    blockWs.destroy();

    execSync('docker-compose stop', {
      cwd: localNetworkPath,
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

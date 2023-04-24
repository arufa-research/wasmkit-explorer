import { app } from 'electron';
import { Buffer } from 'buffer';
import { Tx } from '@terra-money/terra.js';
import { readMsg } from '@terra-money/msg-reader';
// import isDev from 'electron-is-dev';
// import { FINDER_ORIGIN, DOCS_ORIGIN, DOCKER_ORIGIN } from '../constants';

export const parseTxMsg = (encodedTx: any) => {
  const unpacked = Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });
  return unpacked.body.messages[0];
};

// export const isValidOrigin = (origin) => {
//   const ALLOWED_ORIGINS = [FINDER_ORIGIN, DOCS_ORIGIN, DOCKER_ORIGIN];
//   const parsedOrigin = new URL(origin);
//   return (
//     parsedOrigin.protocol === 'https:'
//     && ALLOWED_ORIGINS.includes(parsedOrigin.origin)
//   );
// };

export const parseTxDescriptionAndMsg = (tx: any) => {
  const msg = parseTxMsg(tx);
  const description = readMsg(msg);
  return { msg: msg.toData(), description };
};

export const setDockIconDisplay = (state: any, win: any) => {
  if (process.platform === 'darwin') {
    app.dock[state ? 'show' : 'hide']();
  } else {
    win.setSkipTaskbar(!!state);
  }
};

// export const validateIpcSender = (senderFrame) => isDev || new URL(senderFrame.url).protocol === 'file:';

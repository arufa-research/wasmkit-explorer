import { dialog, app, Notification } from 'electron';

// DIALOGS
export const showPromptUserRestartDialog = async () => dialog.showMessageBox({
  message: 'Settings which you have changed require a restart to update.  Restart the application?',
  buttons: ['No', 'Yes'],
  title: 'WasmKit-Explorer',
  type: 'question',
});

export const showPromptResetAppDialog = async () => dialog.showMessageBox({
  message: 'This will restore app to factory settings.  Reset the application?',
  buttons: ['No', 'Yes'],
  title: 'WasmKit-Explorer',
  type: 'question',
});

// export const showPathSelectionDialog = async () => dialog.showOpenDialog({
//   message: 'Select your LocalNetwork directory.',
//   title: 'WasmKit-Explorer',
//   type: 'info',
//   defaultPath: app.getPath('appData'),
//   properties: ['openDirectory'],
// });

// export const showSmartContractDialog = async () => dialog.showOpenDialog({
//   message: 'Select your project directory. It must contain a wasmkit.config.js file.',
//   title: 'WasmKit-Explorer',
//   type: 'info',
//   properties: ['openDirectory'],
// });

export const showCustomDialog = async (message: string) => dialog.showMessageBox({
  message,
  title: 'WasmKit-Explorer',
  type: 'warning',
});

export const showStartDockerDialog = async () => dialog.showMessageBox({
  message: 'Start Docker then re-open WasmKit-Explorer. WasmKit-Explorer needs it to run LocalNetwork.',
  title: 'WasmKit-Explorer',
  type: 'warning',
});

export const showMemoryOveruseDialog = async () => dialog.showMessageBox({
  message: 'You\'re running out of memory. If this is a consistent problem try running WasmKit-Explorer in LiteMode.',
  title: 'WasmKit-Explorer',
  type: 'warning',
});

export const showMissingSchemaDialog = async () => dialog.showMessageBox({
  message: 'Some schemas were missing from your wasmkit project directory. Run `cargo schema` in your contract folder and re-import access contract methods.',
  title: 'WasmKit-Explorer',
  type: 'warning',
});

export const showWrongDirectoryDialog = async () => dialog.showMessageBox({
  message: 'Please select a valid LocalNetwork directory',
  title: 'WasmKit-Explorer',
  type: 'warning',
});

export const showLocalNetworkAlreadyExistsDialog = async () => dialog.showMessageBox({
  message: `LocalNetwork already exists in the default installation folder '${app.getPath('appData')}/LocalNetwork'. 
    Delete the existing LocalNetwork directory to continue with the installation or select it to start WasmKit-Explorer.`,
  title: 'WasmKit-Explorer',
  type: 'warning',
});

export const showNoNetworkinRefsDialog = async () => dialog.showMessageBox({
  message: 'Unable to read contract refs. Make sure wasmkit.config.js exists and is not empty before trying again.',
  title: 'WasmKit-Explorer',
  type: 'error',
});

// NOTIFICATIONS
export const showTxOccuredNotif = (body: string) => {
  new Notification({ title: 'Transaction Occurred', body }).show();
};

export const showLocalNetworkStopNotif = () => {
  new Notification({ title: 'Stopping LocalNetwork...', silent: true }).show();
};

export const showLocalNetworkStartNotif = () => {
  new Notification({ title: 'Starting LocalNetwork...', silent: true }).show();
};

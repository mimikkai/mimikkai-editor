'use strict';

// Builtin MimikkAI Editor extension pack pointer.
// On startup, installs the MimikkAI marketplace extension pack if missing.

const PACK_ID = 'MimikkAi.mimikkai-editor-extension-pack';

function isInstalled(vscode) {
  try {
  return Boolean(vscode.extensions.getExtension(PACK_ID));
  } catch (e) {
  return true; // API unavailable — assume installed to avoid loops
  }
}

function installOnce() {
  const vscode = require('vscode');
  if (isInstalled(vscode)) {
  return;
  }
  vscode.commands.executeCommand('workbench.extensions.installExtension', PACK_ID)
  .then(
  () => {
  try {
  vscode.window.showInformationMessage('MimikkAI extension pack installed from the marketplace.');
  } catch (e) { /* ignore */ }
  },
  () => {
  try {
  vscode.window.setStatusBarMessage(
  'MimikkAI extension pack is not installed yet (MimikkAI: Install Extension Pack).',
  10000
  );
  } catch (e) { /* ignore */ }
  }
  );
}

function activate(context) {
  const vscode = require('vscode');
  context.subscriptions.push(vscode.commands.registerCommand('mimikkai.pack.install', () => {
  vscode.commands.executeCommand('workbench.extensions.installExtension', PACK_ID)
  .then(
  () => vscode.window.showInformationMessage('MimikkAI extension pack installed from the marketplace.'),
  (err) => vscode.window.showErrorMessage(`MimikkAI extension pack install failed: ${err && err.message ? err.message : err}`)
  );
  }));
  // Defer so the workbench finishes startup before triggering the install.
  setTimeout(installOnce, 3000);
}

function deactivate() { }

module.exports = { activate, deactivate };

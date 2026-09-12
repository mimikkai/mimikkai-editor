'use strict';

// Builtin pointer: installs the Russian language pack on startup if missing,
// then sets the display language to Russian.

const LANG_PACK_ID = 'MS-CEINTL.vscode-language-pack-ru';
const LOCALE = 'ru';

function activate(context) {
	const vscode = require('vscode');
	context.subscriptions.push(vscode.commands.registerCommand('mimikkai.lang.installRu', () => {
		vscode.commands.executeCommand('workbench.extensions.installExtension', LANG_PACK_ID)
			.then(
				() => vscode.window.showInformationMessage('Russian language pack installed. Restart MimikkAI Editor to apply.'),
				(err) => vscode.window.showErrorMessage(`Russian language pack install failed: ${err && err.message ? err.message : err}`)
			);
	}));

	setTimeout(() => {
		let installed = false;
		try {
			installed = Boolean(vscode.extensions.getExtension(LANG_PACK_ID));
		} catch (e) { installed = true; }
		if (!installed) {
			try {
				vscode.commands.executeCommand('workbench.action.configureLocale', LOCALE);
			} catch (e) { /* ignore */ }
			vscode.commands.executeCommand('workbench.extensions.installExtension', LANG_PACK_ID)
				.then(
					() => vscode.window.showInformationMessage('Russian language pack installed. Restart MimikkAI Editor to switch the interface to Russian.'),
					() => vscode.window.setStatusBarMessage('Russian language pack is not installed yet (MimikkAI: Install Russian Language Pack).', 10000)
				);
		}
	}, 3000);
}

function deactivate() { }

module.exports = { activate, deactivate };

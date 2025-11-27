import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('antigravity.annotate', () => {
    const panel = vscode.window.createWebviewPanel(
      'antigravityAnnotator',
      'Annotator',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview-dist')]
      }
    );

    const webviewContentPath = path.join(context.extensionPath, 'webview-dist', 'index.html');
    panel.webview.html = fs.readFileSync(webviewContentPath, 'utf8');

    const apiKey = vscode.workspace.getConfiguration('antigravity-annotator').get('geminiApiKey');
    if (apiKey) {
      panel.webview.postMessage({ command: 'setApiKey', key: apiKey });
    }

    panel.webview.onDidReceiveMessage(
      message => {
        if (message.command === 'openSettings') {
          vscode.commands.executeCommand('workbench.action.openSettings', '@id:antigravity-annotator.geminiApiKey');
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

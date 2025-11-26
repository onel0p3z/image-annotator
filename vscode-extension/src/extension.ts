import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('antigravity.annotate', () => {
    const panel = vscode.window.createWebviewPanel(
      'antigravityAnnotator',
      'Annotator',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    // Load the built React app here
    // You must map the script src tags to vscode-resource URIs
    // panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
  });

  context.subscriptions.push(disposable);
}

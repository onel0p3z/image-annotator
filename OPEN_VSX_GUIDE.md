# Publishing Antigravity Annotator to Open VSX

To turn this React Web App into a VS Code extension publishable on open-vsx.org, follow these steps.

## 1. Extension Structure
Create a new folder for the extension wrapper. You need a `package.json` that defines the extension capabilities.

```json
{
  "name": "antigravity-annotator",
  "displayName": "Antigravity Annotator",
  "description": "Image annotation tool for AI context",
  "version": "1.0.0",
  "publisher": "your-name",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "antigravity.annotate",
        "title": "Annotate Image from Clipboard"
      }
    ]
  }
}
```

## 2. Webview Implementation
In your extension's `activate` function, you will create a WebviewPanel.

1. Build this React app using Vite or Webpack into a single HTML file (or a bundle of JS/CSS).
2. Read the built HTML content in your extension code.
3. Set the `webview.html` to the built content.

Example `extension.ts`:

```typescript
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
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
  });

  context.subscriptions.push(disposable);
}
```

## 3. Handling API Keys
VS Code extensions should not use `process.env`. Instead, use `vscode.workspace.getConfiguration` to let users store their Gemini API Key safely. Pass this key to the Webview via `postMessage`.

In `App.tsx`, listen for the message:
```typescript
window.addEventListener('message', event => {
  const message = event.data;
  if (message.command === 'setApiKey') {
     // initialize Gemini with message.key
  }
});
```

## 4. Packaging
1. Install `vsce` (Visual Studio Code Extensions) CLI: `npm install -g @vscode/vsce`
2. Run `vsce package` to create a `.vsix` file.
3. Create an account on [open-vsx.org](https://open-vsx.org).
4. Create a namespace and upload your `.vsix` file.

## 5. Antigravity IDE
If "Antigravity IDE" is a web-based IDE (like Project IDX), this React app can likely be deployed as a standalone web tool or an internal plugin without the full VS Code wrapper.

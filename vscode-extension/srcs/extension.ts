import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI } from "@google/genai";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('image-annotator.annotate', () => {
    const panel = vscode.window.createWebviewPanel(
      'imageAnnotator',
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

    // Helper to check and send key status
    const sendKeyStatus = () => {
      const apiKey = vscode.workspace.getConfiguration('image-annotator').get<string>('geminiApiKey');
      panel.webview.postMessage({ command: 'apiKeyStatus', hasKey: !!apiKey && apiKey.trim().length > 0 });
    };

    // Initial check
    sendKeyStatus();

    // Listen for config changes
    const configListener = vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('image-annotator.geminiApiKey')) {
        sendKeyStatus();
      }
    });
    
    // Clean up listener when panel closes
    panel.onDidDispose(() => {
      configListener.dispose();
    });

    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'openSettings') {
          vscode.commands.executeCommand('workbench.action.openSettings', '@id:image-annotator.geminiApiKey');
        } else if (message.command === 'checkApiKey') {
          sendKeyStatus();
        } else if (message.command === 'analyzeImage') {
          const apiKey = vscode.workspace.getConfiguration('image-annotator').get<string>('geminiApiKey');
          
          if (!apiKey) {
            panel.webview.postMessage({ command: 'analysisError', error: 'API Key is missing' });
            return;
          }

          try {
            const genAI = new GoogleGenAI({ apiKey });
            const cleanBase64 = message.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

            const response = await genAI.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: {
                parts: [
                  {
                    inlineData: {
                      mimeType: 'image/png',
                      data: cleanBase64
                    }
                  },
                  {
                    text: message.prompt
                  }
                ]
              },
              config: {
                systemInstruction: "You are an expert coding assistant integrated into an IDE. Analyze the screenshot provided by the user. Pay special attention to the red or highlighted annotations.",
              }
            });

            panel.webview.postMessage({ command: 'analysisResult', text: response.text });

          } catch (error: any) {
            panel.webview.postMessage({ 
              command: 'analysisError', 
              error: error.message || "Unknown error", 
              stack: error.stack 
            });
          }
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

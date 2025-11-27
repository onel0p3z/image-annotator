<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12_bAVgqXJhSXFdrGuAlohvkOx70r1VU9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run as a VS Code Extension Locally

To test the extension locally:

1. **Install Dependencies:**
   - Run `npm install` in the root directory.
   - Run `npm install` in the `vscode-extension` directory.

2. **Build the React App:**
   - Run `npm run build` from the root directory. This will build the webview and place it in `vscode-extension/webview-dist`.

3. **Run in VS Code:**
    - Open the `vscode-extension` directory in VS Code.
    - Press `F5` to open a new VS Code window with the extension loaded.

4. **Run the Extension:**
   - Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`).
   - Run the "Annotate Image from Clipboard" command.

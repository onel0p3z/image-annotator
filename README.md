# Image Annotator

<div align="center">

<img src="images/icon.png" width="128" alt="Image Annotator Logo" />

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![VS Code](https://img.shields.io/badge/vscode-%5E1.80.0-blueviolet.svg)

**Annotate, Analyze, and Share Images without leaving VS Code.**

</div>

![Image Annotator Screenshot](images/main-app-view.png)

---

**Image Annotator** is a powerful VS Code extension designed to bridge the gap between visual context and code. Whether you're reporting a UI bug, documenting a complex architecture diagram, or asking AI for help with a visual layout, Image Annotator makes it seamless.

## ✨ Features

*   **🎨 Rich Annotation Tools:** Draw arrows, shapes, text, and sequences directly on images.
*   **🤖 AI-Powered Analysis:** Use Google's Gemini AI to find bugs, explain diagrams, or generate code from screenshots.
*   **🔒 Privacy First:** Redact sensitive info with blur tools. API keys are stored securely in VS Code.

---

## 🚀 Getting Started (Users)

### 1. Installation
Install "Image Annotator" from the VS Code Marketplace or download the `.vsix` file from the [latest GitHub Release](https://github.com/onel0p3z/image-annotator/releases).

### 2. Setup API Key
To use AI features, you need a Gemini API Key:
1.  Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In VS Code, open **Settings** (`Ctrl+,`) and search for `Image Annotator`.
3.  Paste your key into the **Gemini Api Key** field.

### 3. Usage
*   **Open:** Press `Ctrl+Shift+P` and run `Annotate Image`, or right-click in any editor.
*   **Add Image:** Paste (`Ctrl+V`) or use the **Upload** button.
*   **Analyze:** Click **Ask AI** to get insights from Gemini.

---

## ⚙️ Settings

*   `image-annotator.geminiApiKey`: Your Google Gemini API Key.

---

## 🛠️ Development & Building (From Source)

If you want to build the extension yourself or contribute, follow these steps.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   VS Code (v1.80+)

### Setup & Build
1.  **Clone the repo:**
    ```bash
    git clone https://github.com/onel0p3z/image-annotator.git
    cd image-annotator
    ```
2.  **Install dependencies (Root & Extension):**
    ```bash
    npm install
    cd vscode-extension && npm install && cd ..
    ```
3.  **Build the Webview (Frontend):**
    ```bash
    npm run build
    ```
4.  **Compile the Extension (Backend):**
    ```bash
    cd vscode-extension && npm run compile && cd ..
    ```

### Running the Extension
1.  Open the project in VS Code.
2.  Press `F5` to start the **Extension Development Host**.
3.  Run the `Annotate Image` command in the new window.

### Packaging
To create a `.vsix` file for manual installation:
```bash
cd vscode-extension
npx @vscode/vsce package
```

---

**Enjoy building with visual context!**
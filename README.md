# Image Annotator

<div align="center">

<img src="images/image-annotator.png" width="128" alt="Image Annotator Logo" />

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![VS Code](https://img.shields.io/badge/vscode-%5E1.80.0-blueviolet.svg)

**Annotate, Analyze, and Share Images without leaving VS Code.**

</div>

![Image Annotator Screenshot](images/main-app-view.png)

---

**Image Annotator** is a powerful VS Code extension designed to bridge the gap between visual context and code. Whether you're reporting a UI bug, documenting a complex architecture diagram, or asking AI for help with a visual layout, Image Annotator makes it seamless.

## ✨ Features

### 🎨 Rich Annotation Tools
Paste any image from your clipboard and start annotating immediately.
*   **Draw:** Pen tool for freehand sketches.
*   **Highlight:** Arrows, Rectangles, and Circles to point out details.
*   **Context:** Add Text labels to explain your thoughts.
*   **Sequence:** Use the Counter tool (`#`) to create step-by-step flows (1, 2, 3...).
*   **Privacy:** Redact sensitive info with the Pixelate/Blur tool.

![Annotation Example](images/example-annotated-1764644482910.png)

### 🤖 AI-Powered Analysis (Gemini)
Don't just draw—**ask**. Integrated with Google's Gemini AI (2.5 Flash), you can:
*   **Find Bugs:** Highlight a UI glitch and ask AI "Why does this look wrong compared to standard Material Design?"
*   **Explain Code:** Paste a diagram of an architecture and ask "Explain this data flow."
*   **Generate Code:** Paste a screenshot of a UI element and ask "Generate the React/Tailwind code for this component."

### 🔒 Privacy First
*   Your images are processed locally for drawing.
*   AI analysis is performed via your own personal API Key.
*   Your API Key is stored securely in VS Code's encrypted secret storage/settings and is **never** exposed to the webview or third parties.

---

## 🚀 Getting Started (Users)

### 1. Installation
Install "Image Annotator" from the VS Code Marketplace or download the `.vsix` from releases.

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

## 🛠️ Development & Building (From Source)

Follow these steps to build the extension from source.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [VS Code](https://code.visualstudio.com/)
*   `vsce` (for packaging): `npm install -g @vscode/vsce`

### 1. Clone & Install
```bash
git clone https://github.com/onel0p3z/image-annotator.git
cd image-annotator
npm install
cd vscode-extension && npm install && cd ..
```

### 2. Build the Webview
The annotator UI is a React app. It must be built into a single file for the extension to consume:
```bash
npm run build
```
This generates `vscode-extension/webview-dist/index.html`.

### 3. Build the Extension
Compile the TypeScript extension host code:
```bash
cd vscode-extension
npm run compile
```

### 4. Run & Debug
1.  Open the root folder in VS Code.
2.  Press `F5` to launch a new **Extension Development Host** window.
3.  In the new window, use the command `Annotate Image` to test your changes.

### 5. Packaging
To create a `.vsix` file for manual installation:
```bash
cd vscode-extension
vsce package
```

---

**Enjoy building with visual context!**

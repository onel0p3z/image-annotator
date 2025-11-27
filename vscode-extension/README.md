# Image Annotator

<div align="center">

<img src="images/icon.png" width="128" alt="Image Annotator Logo" />

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![VS Code](https://img.shields.io/badge/vscode-%5E1.80.0-blueviolet.svg)

**Annotate, Analyze, and Share Images without leaving VS Code.**

</div>

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

## 🚀 Getting Started

### 1. Installation
Install "Image Annotator" from the VS Code Marketplace.

### 2. Setup API Key
To use the AI features, you need a Google Gemini API Key.
1.  Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In VS Code, go to **Settings** (`Ctrl+,` / `Cmd+,`).
3.  Search for `Image Annotator`.
4.  Paste your key into the **Gemini Api Key** field.

### 3. Usage
1.  **Open the Annotator:**
    *   Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) -> Type `Annotate Image`.
    *   *Or* Right-click in any text editor -> Select `Annotate Image`.
2.  **Add an Image:**
    *   Copy an image to your clipboard and press `Ctrl+V` (Cmd+V) in the annotator.
    *   Or use the **Upload** button in the toolbar.
3.  **Annotate & Analyze:**
    *   Use the toolbar to draw.
    *   Click **Ask AI** to send the annotated image to Gemini.
    *   Click **Copy** to put the annotated image back on your clipboard.

---

## ⚙️ Extension Settings

This extension contributes the following settings:

*   `image-annotator.geminiApiKey`: The API key used for authenticating with Google Gemini services.

---

## 📝 Release Notes

### 1.0.0
*   🎉 Initial release!
*   Basic annotation tools (Pen, Arrow, Shape, Text, Blur, Count).
*   Clipboard support for copy/paste.
*   Gemini 2.5 Flash integration for image analysis.

---

**Enjoy building with visual context!**

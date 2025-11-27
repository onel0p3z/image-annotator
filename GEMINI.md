# Antigravity Annotator

## Project Overview

**Antigravity Annotator** is a specialized image annotation tool designed to streamline the process of providing visual context to AI agents. It functions as both a standalone web application and a VS Code extension.

**Core Features:**
*   **Image Input:** Paste images directly from the clipboard or upload via file picker.
*   **Annotation Tools:** Draw arrows, rectangles, and other shapes to highlight specific areas of an image (e.g., bugs in a UI screenshot, code logic flows).
*   **Gemini Integration:** Directly analyze the annotated image using the Gemini API to get descriptions, bug findings, or code improvements.
*   **Export:** Copy the annotated image to the clipboard or download it for easy sharing with AI agents or teammates.

## Tech Stack

*   **Frontend Framework:** React 19 (with TypeScript)
*   **Build Tool:** Vite (using `vite-plugin-singlefile` for portable builds)
*   **Styling:** Tailwind CSS (inferred from utility classes) & Lucide React (icons)
*   **AI Integration:** `@google/genai` SDK
*   **Extension:** VS Code Extension API (Webview-based)

## Architecture

The project is structured as a monorepo-style setup where the core UI is a React app that is bundled into a single HTML file and consumed by the VS Code extension.

*   **Root:** Contains the React application source code.
    *   `App.tsx`: Main application controller, state management, and UI layout.
    *   `components/`: UI components (`CanvasBoard`, `Toolbar`).
    *   `services/`: External service integrations (`geminiService.ts`).
*   **`vscode-extension/`:** Contains the VS Code extension wrapper.
    *   `srcs/extension.ts`: Extension entry point that activates the Webview.
    *   `webview-dist/`: Target directory where the built React app is placed.

## Development Workflow

### Prerequisites
*   Node.js
*   `vsce` (for packaging the extension): `npm install -g vsce`

### 1. Setup
Install dependencies for both the root React app and the extension folder:
```bash
npm install
cd vscode-extension && npm install && cd ..
```

### 2. Running the Web App
To develop the UI in a browser environment with hot-reloading:
```bash
npm run dev
```
*   **Note:** Gemini API features require a `GEMINI_API_KEY` in `.env.local`.

### 3. Building for VS Code
To prepare the React app for the extension (bundles into a single HTML file):
```bash
npm run build
```
This populates `vscode-extension/webview-dist/index.html`.

### 4. Running the VS Code Extension
1.  Ensure the webview is built (step 3).
2.  Open the project in VS Code.
3.  Press `F5` to launch the Extension Development Host.
4.  Use the command **"Annotate Image from Clipboard"** to open the tool.

### 5. Packaging
To create a `.vsix` file for installation:
```bash
cd vscode-extension
vsce package
```

## Key Conventions
*   **State Management:** `App.tsx` serves as the central state container for tool selection, history (undo/redo), and image data.
*   **Canvas Logic:** Canvas interactions are encapsulated in `CanvasBoard.tsx`.
*   **Styling:** standard Tailwind utility classes are used, with custom colors defined for IDE theming (e.g., `bg-ide-bg`).

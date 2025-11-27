# Adding Images and Icons to Your Extension

This guide explains how to add a custom icon and screenshots to your VS Code extension so they appear correctly in the Marketplace and within VS Code.

## 1. Create an Assets Folder

Create a folder named `images` inside the `vscode-extension` directory to store your visual assets.

```bash
mkdir vscode-extension/images
```

## 2. Add Your Image Files

Place your image files into this new folder.
*   **Icon:** Name it `icon.png` (recommended size: 128x128 or 512x512 pixels).
*   **Screenshots:** Name them descriptively, e.g., `demo-screenshot.png`.

## 3. Configure the Extension Icon

To make `icon.png` the official icon for your extension (visible in the Marketplace and Extensions sidebar):

1.  Open `vscode-extension/package.json`.
2.  Add the `"icon"` property at the top level:

```json
{
  "name": "image-annotator",
  "displayName": "Image Annotator",
  "icon": "images/icon.png",
  ...
}
```

## 4. Add Images to README.md

To display the icon or screenshots in your extension's documentation:

1.  Open `vscode-extension/README.md`.
2.  Use standard Markdown syntax with relative paths:

```markdown
# Image Annotator

<!-- Centered Logo -->
<div align="center">
  <img src="images/icon.png" width="128" alt="Image Annotator Logo" />
</div>

...

## Screenshots

Here is the annotator in action:

![Annotation Demo](images/demo-screenshot.png)
```

## 5. Verify Packaging

Ensure that your `images` folder is included when the extension is packaged.

1.  Check `vscode-extension/.vscodeignore`.
2.  Ensure it **does NOT** contain a line like `images/` or `*.png`.

## 6. Publish

When you run `vsce package` or `vsce publish`:
*   VS Code will bundle the icon file into the `.vsix`.
*   For the README, VS Code uses the `"repository"` field in `package.json` to resolve relative image paths to absolute URLs (e.g., raw.githubusercontent.com...) so they render correctly on the Marketplace website.

**Important:** ensure your code (and images) are pushed to the repository URL specified in your `package.json` for the README images to load correctly on the Marketplace.

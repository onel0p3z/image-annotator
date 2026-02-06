import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Defensive fix for "InvalidStateError: Failed to register a ServiceWorker"
// This error happens in some VS Code environments (e.g. web-based IDEs)
try {
  if ('serviceWorker' in navigator) {
     // @ts-ignore
     delete navigator.serviceWorker;
  }
} catch (e) {
  console.error("Failed to disable service worker", e);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

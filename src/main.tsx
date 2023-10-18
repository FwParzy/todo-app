import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
try {
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message);
    });
} catch (error) {
    console.warn("ipcRenderer is not defined. Ignoring the error.");
}

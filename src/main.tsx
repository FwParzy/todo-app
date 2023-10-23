import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import App from './App.tsx'
import Login from './Login.tsx';
import Register from './Register.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />}/>
                <Route path='/' element={<Register />}/>
            </Routes>
        </BrowserRouter>
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

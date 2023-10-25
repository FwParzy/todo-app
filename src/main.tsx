import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login.tsx';
import Register from './Register.tsx';
import App from './App.tsx';
import { AuthContextProvider } from './context/authContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='/' element={<App />}></Route>
                </Routes>
            </BrowserRouter>
        </AuthContextProvider>
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

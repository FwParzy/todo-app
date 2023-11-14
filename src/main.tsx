import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.css";
import "./css/styles.css"
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import App from './pages/App.tsx';
import EditUser from './pages/EditUser.tsx';
import { AuthContextProvider } from './context/authContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContextProvider>
            <HashRouter>
                <Routes>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='/editUser' element={<EditUser />}></Route>
                    <Route path='/' element={<App />}></Route>
                </Routes>
            </HashRouter>
        </AuthContextProvider>
    </React.StrictMode>,
)

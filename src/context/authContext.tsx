import { useEffect, createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { User } from '../types/userType';
import { LoginInputType } from '../types/loginInputType';
import { EditUserInputType } from '../types/editUserInputType';
import axiosInstance from './axiosContext';

type AuthContextType = {
  currentUser: User;
  login: (inputs: LoginInputType) => Promise<void>;
  editUser: (inputs: EditUserInputType) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  );

  const login = async (inputs: LoginInputType) => {
    const res = await axiosInstance.post('/api/auth/login', inputs);
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axiosInstance.post('/api/auth/logout');
    setCurrentUser(null);
  };

  const editUser = async (inputs: EditUserInputType) => {
    const res = await axiosInstance.post('/api/auth/editUser', inputs);
    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, editUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};


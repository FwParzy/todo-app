import axios from 'axios';
import { useEffect, createContext, useState } from 'react';
import PropTypes from 'prop-types';

type AuthContextType = {
  currentUser: any;
  login: (inputs: any) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  );

  const login = async (inputs) => {
    const res = await axios.post('http://localhost:8081/api/auth/login', inputs);
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post('http://localhost:8081/api/auth/logout');
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};


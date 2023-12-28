// AuthContext.js
import { createContext, useContext, useState } from 'react';
import { REST_ENDPOINT, STORAGE_KEY } from '../constants';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState(null);

  const login = async (username: string, password: string) => {
    const formData = {
      id: '',
      username,
      password,
      login: true,
    };
    // Perform login API request
    const response = await fetch(`${REST_ENDPOINT}/security`, {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    // Perform logout actions, e.g., clear user data
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem('user-name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

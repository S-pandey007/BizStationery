import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check user login status on app start
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData)); // Set user state if found
      }
    };
    loadUser();
  }, []);

  // Login function
  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

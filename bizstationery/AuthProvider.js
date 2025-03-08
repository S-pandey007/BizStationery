import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Check user login status on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("loggedInUser")
        console.log("Loaded user from AsyncStorage:", storedUser);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("User set from AsyncStorage:", JSON.parse(storedUser));
        }else {
          console.log("No user found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error loading user from AsyncStorage : ",error);
      }finally {
        setLoading(false);
        console.log("AuthProvider loading finished, user:", user);
      }
    };
    loadUser();
  }, []);

  // Login function
  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData));
    console.log("Logged in user saved:", userData);
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('loggedInUser');
    console.log("Logged out, user cleared");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

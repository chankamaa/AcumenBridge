// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUserProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  const value = { user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
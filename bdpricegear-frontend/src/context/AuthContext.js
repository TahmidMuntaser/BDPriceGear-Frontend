'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    setIsMounted(true);
    checkAuth();
  }, []);

  // Listen for auto-logout events (from token expiry)
  useEffect(() => {
    const handleAutoLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleAutoLogout);
      return () => {
        window.removeEventListener('auth:logout', handleAutoLogout);
      };
    }
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      if (authAPI.isAuthenticated()) {
        const storedUser = authAPI.getStoredUser();
        if (storedUser) {
          setIsLoggedIn(true);
          setUser(storedUser);
        } else {
          try {
            const userData = await authAPI.getProfile();
            setIsLoggedIn(true);
            setUser(userData);
          } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      toast.success('Logged out successfully. See you soon!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed, but you have been signed out locally.');
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        checkAuth,
        isLoginModalOpen,
        isSignupModalOpen,
        openLoginModal,
        closeLoginModal,
        openSignupModal,
        closeSignupModal,
        switchToSignup,
        switchToLogin,
        isMounted,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

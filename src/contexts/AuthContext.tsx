import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';
import { mapFirebaseUser, signIn, signUp, signOut, resetPassword } from '../services/authService';
import { useAppDispatch } from '../hooks/useRedux';
import { setUser, setLoading, clearAuth } from '../store/authSlice';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoadingState] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser = mapFirebaseUser(firebaseUser);
        setUserState(mappedUser);
        dispatch(setUser(mappedUser));
      } else {
        setUserState(null);
        dispatch(clearAuth());
      }
      setLoadingState(false);
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  const handleSignIn = async (email: string, password: string) => {
    setLoadingState(true);
    dispatch(setLoading(true));
    try {
      await signIn(email, password);
    } catch (error: any) {
      setLoadingState(false);
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    setLoadingState(true);
    dispatch(setLoading(true));
    try {
      await signUp(email, password, displayName);
    } catch (error: any) {
      setLoadingState(false);
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleSignOut = async () => {
    setLoadingState(true);
    dispatch(setLoading(true));
    try {
      await signOut();
    } catch (error: any) {
      setLoadingState(false);
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error: any) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

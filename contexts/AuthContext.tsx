'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUser as setStoredUser,
  getUser as getStoredUser,
} from '@/lib/auth';
import type { User, SignInRequest, SignUpRequest } from '@/types/auth.types';
import type { ApiError } from '@/types/api.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (userData: SignUpRequest) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);

        try {
          // Backend returns UserDto directly from /user/api/profile
          const response = await apiClient.get<User>(
            API_ENDPOINTS.AUTH.ME,
            true
          );
          setUser(response);
          setStoredUser(response);
        } catch (error) {
          removeAuthToken();
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = useCallback(async (credentials: SignInRequest) => {
    try {
      setLoading(true);
      setError(null);

      // Backend returns { token: string } from AuthResponse.java
      const response = await apiClient.post<{ token: string }>(
        API_ENDPOINTS.AUTH.SIGNIN,
        credentials
      );

      setAuthToken(response.token);

      // Backend returns UserDto directly from /user/api/profile
      const userResponse = await apiClient.get<User>(
        API_ENDPOINTS.AUTH.ME,
        true
      );

      setStoredUser(userResponse);
      setUser(userResponse);

      router.push('/listings');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const signUp = useCallback(async (userData: SignUpRequest) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Sending signup request with data:', userData);
      await apiClient.post(
        API_ENDPOINTS.AUTH.SIGNUP,
        userData
      );
      console.log('Signup successful, now logging in...');

      // Backend returns { token: string } from AuthResponse.java
      const loginResponse = await apiClient.post<{ token: string }>(
        API_ENDPOINTS.AUTH.SIGNIN,
        {
          username: userData.username,
          password: userData.password,
        }
      );
      console.log('Login response:', loginResponse);

      setAuthToken(loginResponse.token);

      // Backend returns UserDto directly from /user/api/profile
      const userResponse = await apiClient.get<User>(
        API_ENDPOINTS.AUTH.ME,
        true
      );
      console.log('User details:', userResponse);

      setStoredUser(userResponse);
      setUser(userResponse);

      router.push('/listings');
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Signup error:', apiError);
      setError(apiError.message || 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const signOut = useCallback(() => {
    removeAuthToken();
    setUser(null);
    router.push('/');
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userResponse = await apiClient.get<User>(
        API_ENDPOINTS.AUTH.ME,
        true
      );
      setUser(userResponse);
      setStoredUser(userResponse);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

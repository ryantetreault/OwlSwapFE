import { STORAGE_KEYS } from './constants';
import type { User } from '@/types/auth.types';

const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setCookie(STORAGE_KEYS.AUTH_TOKEN, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    deleteCookie(STORAGE_KEYS.AUTH_TOKEN);
  }
};

export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

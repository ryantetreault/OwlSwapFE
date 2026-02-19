import { API_BASE_URL } from './constants';
import { getAuthToken, removeAuthToken } from './auth';
import type { ApiError } from '@/types/api.types';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, headers, ...restConfig } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          requestHeaders[key] = value;
        }
      });
    }

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...restConfig,
        headers: requestHeaders,
      });

      if (response.status === 401) {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin?error=session_expired';
        }
        throw new Error('Session expired. Please sign in again.');
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        if (!response.ok) {
          throw {
            message: `Server error: ${response.status} ${response.statusText}`,
            status: response.status,
          } as ApiError;
        }
        data = {};
      }

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          endpoint: endpoint
        });
        const error: ApiError = {
          message: data.message || data.error || `Server error: ${response.status}`,
          status: response.status,
          errors: data.errors,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }

      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }

      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

import { API_BASE_URL } from './constants';
import { getAuthToken, removeAuthToken, setAuthToken } from './auth';
import type { ApiError } from '@/types/api.types';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private refreshing: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async handleUnauthorized(): Promise<string> {
    // If already refreshing, wait for that promise
    if (this.refreshing) {
      return this.refreshing;
    }

    // Start refresh process
    this.refreshing = fetch(`${this.baseURL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Send HTTP-only refresh token cookie
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Refresh failed');
        }
        const data = await res.json();
        setAuthToken(data.token); // Update stored token
        return data.token;
      })
      .catch((error) => {
        // If refresh fails, clear auth and redirect to login
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin?error=session_expired';
        }
        throw error;
      })
      .finally(() => {
        this.refreshing = null;
      });

    return this.refreshing;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
    retryCount = 0
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
        credentials: 'include', // Send cookies for refresh token
      });

      // Handle 401 with token refresh (only retry once)
      if (response.status === 401 && requiresAuth && retryCount === 0) {
        try {
          const newToken = await this.handleUnauthorized();
          // Retry request with new token
          requestHeaders['Authorization'] = `Bearer ${newToken}`;
          return this.request<T>(endpoint, config, retryCount + 1);
        } catch (refreshError) {
          // Refresh failed, already handled in handleUnauthorized
          throw new Error('Session expired. Please sign in again.');
        }
      }

      // If we get 401 after refresh attempt, give up
      if (response.status === 401) {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin?error=session_expired';
        }
        throw new Error('Session expired. Please sign in again.');
      }

      let data;
      const contentType = response.headers.get('content-type');

      try {
        // Only try to parse JSON if the content-type is JSON
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If not JSON, get the text
          const text = await response.text();
          data = { message: text || response.statusText };
        }
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
          contentType: contentType,
          data: data,
          endpoint: endpoint
        });

        // Handle different error response formats
        let errorMessage = 'An error occurred';

        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors[0];
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
          error: data.error,
          path: data.path,
          timestamp: data.timestamp,
          errors: data.errors,
          fieldErrors: data.fieldErrors,
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

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth = false,
    retryCount = 0
  ): Promise<T> {
    const requestHeaders: Record<string, string> = {};

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Don't set Content-Type for FormData - browser will set it with boundary

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: requestHeaders,
        body: formData,
        credentials: 'include', // Send cookies for refresh token
      });

      // Handle 401 with token refresh (only retry once)
      if (response.status === 401 && requiresAuth && retryCount === 0) {
        try {
          const newToken = await this.handleUnauthorized();
          requestHeaders['Authorization'] = `Bearer ${newToken}`;
          // Retry request with new token
          return this.postFormData<T>(endpoint, formData, requiresAuth, retryCount + 1);
        } catch (refreshError) {
          throw new Error('Session expired. Please sign in again.');
        }
      }

      // If we get 401 after refresh attempt, give up
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
        const error: ApiError = {
          message: data.message || data.error || `Server error: ${response.status}`,
          status: response.status,
          error: data.error,
          path: data.path,
          timestamp: data.timestamp,
          errors: data.errors,
          fieldErrors: data.fieldErrors,
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

  async putFormData<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth = false,
    retryCount = 0
  ): Promise<T> {
    const requestHeaders: Record<string, string> = {};

    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Don't set Content-Type for FormData - browser will set it with boundary

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: requestHeaders,
        body: formData,
        credentials: 'include', // Send cookies for refresh token
      });

      // Handle 401 with token refresh (only retry once)
      if (response.status === 401 && requiresAuth && retryCount === 0) {
        try {
          const newToken = await this.handleUnauthorized();
          requestHeaders['Authorization'] = `Bearer ${newToken}`;
          // Retry request with new token
          return this.putFormData<T>(endpoint, formData, requiresAuth, retryCount + 1);
        } catch (refreshError) {
          throw new Error('Session expired. Please sign in again.');
        }
      }

      // If we get 401 after refresh attempt, give up
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
        const error: ApiError = {
          message: data.message || data.error || `Server error: ${response.status}`,
          status: response.status,
          error: data.error,
          path: data.path,
          timestamp: data.timestamp,
          errors: data.errors,
          fieldErrors: data.fieldErrors,
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
}

export const apiClient = new ApiClient(API_BASE_URL);

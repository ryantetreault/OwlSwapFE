export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/user/api/profile',
    UPDATE_PROFILE: '/user/api/update',
  },
  ITEMS: {
    ALL: '/item/all',
    SEARCH: '/item/search', // Added search endpoint
    BY_ID: (id: number) => `/item/${id}`,
    BY_OWNER: (userId: number) => `/item/${userId}/owner`,
    CREATE: '/item/add',
    UPDATE: '/item/update',
    DELETE: (id: number) => `/item/${id}/delete`,
    TYPES: '/item/types',
  },
  CATEGORIES: {
    ALL: '/item/categories', // Returns array of CategoryDto directly
  },
  LOCATIONS: {
    ALL: '/api/locations',
    BY_ID: (id: number) => `/api/locations/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'owl_swap_auth_token',
  USER: 'owl_swap_user',
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/user/profile', // Fixed: backend uses /user/profile not /user/api/profile
  },
  USERS: {
    ALL: '/user/all', // Get all users
    BY_ID: (id: number) => `/user/${id}`, // Get user by ID
    PROFILE: '/user/profile', // Current user profile (JWT-based)
    RATE: (id: number) => `/user/rate/${id}`, // Rate a user
    DELETE: (id: number) => `/user/${id}/delete`, // Delete user
    ITEMS: (id: number) => `/user-items/${id}/items`, // Get user's items
    SUBSCRIPTIONS: '/user-subscriptions/subscriptions', // Get user subscriptions
  },
  ITEMS: {
    ALL: '/item/all',
    SEARCH: '/item/search',
    BY_ID: (id: number) => `/item/${id}`,
    BY_OWNER: (userId: number) => `/item/${userId}/owner`,
    CREATE: '/item/add',
    CREATE_WITH_IMAGES: '/item/add/with-images', // Multipart upload
    UPDATE: '/item/update',
    UPDATE_WITH_IMAGES: '/item/update/with-images', // Multipart upload
    DELETE: (id: number) => `/item/${id}/delete`,
    TYPES: '/item/types',
    SCHEMA: '/item/schema', // Get field schemas per item type
  },
  CATEGORIES: {
    ALL: '/item/categories', // Returns array of CategoryDto directly
  },
  LOCATIONS: {
    ALL: '/location/all', // Fixed: backend uses /location/all not /api/locations
    BY_ID: (id: number) => `/location/${id}`, // Fixed: backend uses /location/{id}
  },
  FAVORITES: {
    BY_ITEM: (itemId: number) => `/item-favorites/item/${itemId}`,
    BY_USER: '/item-favorites/user/me', // Current user's favorites (JWT-based)
    IS_FAVORITE: (itemId: number) => `/item-favorites/is-favorite/item/${itemId}`,
    ADD: (itemId: number) => `/item-favorites/add-favorite/item/${itemId}`,
    REMOVE: (itemId: number) => `/item-favorites/remove-favorite/item/${itemId}`,
  },
  TRANSACTIONS: {
    ALL: '/transaction/all',
    BY_BUYER: (id: number) => `/transaction/buyer/${id}/all`,
    BY_SELLER: (id: number) => `/transaction/seller/${id}/all`,
    PURCHASE: (itemId: number) => `/transaction/purchase/${itemId}`, // Buyer from JWT
  },
  ORDERS: {
    CREATE: '/order/create',
    CANCEL: (orderId: number) => `/order/${orderId}/cancel`,
    PAY: (orderId: number) => `/order/${orderId}/pay`,
    FULFILL: (orderId: number) => `/order/${orderId}/fulfill`,
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'owl_swap_auth_token',
  USER: 'owl_swap_user',
} as const;

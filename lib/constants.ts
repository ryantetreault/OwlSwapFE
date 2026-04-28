export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/user/profile', // Fixed: backend uses /user/profile not /user/api/profile
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
  },
  USERS: {
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
    ALL: '/location/all',
    BY_ID: (id: number) => `/location/${id}`,
    PRESET: '/location/preset',
    MY_ADDRESSES: '/location/my-addresses',
    MY_ADDRESS_BY_ID: (id: number) => `/location/my-addresses/${id}`,
    CREATE_SELLER: '/location/seller',
    UPDATE_SELLER: (id: number) => `/location/my-addresses/${id}`,
    DELETE_SELLER: (id: number) => `/location/my-addresses/${id}`,
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
    CREATE:             '/orders/create',
    CANCEL:             (orderId: number) => `/orders/${orderId}/cancel`,
    PICKUP_CODE:        (orderId: number) => `/orders/${orderId}/pickup-code`,
    READY_FOR_PICKUP:   (orderId: number) => `/orders/${orderId}/ready-for-pickup`,
    CONFIRM_PICKUP:     (orderId: number) => `/orders/${orderId}/confirm-pickup`,
    REFUND:             (orderId: number) => `/orders/${orderId}/refund`,
    REFUND_REQUEST:     (orderId: number) => `/orders/${orderId}/refund-request`,
    APPROVE_REFUND:     (orderId: number) => `/orders/${orderId}/refund-request/approve`,
    DENY_REFUND:        (orderId: number) => `/orders/${orderId}/refund-request/deny`,
    CHECKOUT_SESSION:   (orderId: number) => `/orders/${orderId}/checkout-session`,
    MY_PURCHASES:       '/orders/my-purchases',
    MY_SALES:           '/orders/my-sales',
  },
  STRIPE: {
    ONBOARDING_LINK: '/stripe/connect/onboarding-link',
    SELLER_STATUS:   '/stripe/connect/status',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'owl_swap_auth_token',
  USER: 'owl_swap_user',
} as const;

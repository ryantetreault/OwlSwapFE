import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type { PaginatedFavoritesResponse } from '@/types/favorite.types';

export const favoritesService = {
  /**
   * Get current user's favorited items (paginated)
   * Extracts userId from JWT token
   */
  getUserFavorites: async (page = 0, size = 6): Promise<PaginatedFavoritesResponse> => {
    return apiClient.get<PaginatedFavoritesResponse>(
      `${API_ENDPOINTS.FAVORITES.BY_USER}?page=${page}&size=${size}`,
      true
    );
  },

  /**
   * Get all favorites for a specific item
   */
  getFavoritesByItem: async (itemId: number): Promise<any> => {
    return apiClient.get<any>(
      API_ENDPOINTS.FAVORITES.BY_ITEM(itemId),
      true
    );
  },

  /**
   * Check if an item is favorited by the current user
   * Returns boolean
   */
  isFavorite: async (itemId: number): Promise<boolean> => {
    return apiClient.get<boolean>(
      API_ENDPOINTS.FAVORITES.IS_FAVORITE(itemId),
      true
    );
  },

  /**
   * Add an item to the current user's favorites
   * Extracts userId from JWT token
   */
  addFavorite: async (itemId: number): Promise<void> => {
    return apiClient.post<void>(
      API_ENDPOINTS.FAVORITES.ADD(itemId),
      undefined,
      true
    );
  },

  /**
   * Remove an item from the current user's favorites
   * Extracts userId from JWT token
   */
  removeFavorite: async (itemId: number): Promise<void> => {
    return apiClient.delete<void>(
      API_ENDPOINTS.FAVORITES.REMOVE(itemId),
      true
    );
  },
};

'use client';

import { useState, useEffect, useCallback } from 'react';
import { favoritesService } from '@/lib/services/favorites.service';
import type { Listing } from '@/types/listing.types';
import type { ApiError } from '@/types/api.types';

interface UseFavoritesReturn {
  favorites: Listing[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  favoriteIds: Set<number>;
  isFavorite: (itemId: number) => boolean;
  toggleFavorite: (itemId: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  setPage: (page: number) => void;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [page, setPageState] = useState(0);

  const fetchFavorites = useCallback(async (pageNum?: number) => {
    const pageToFetch = pageNum !== undefined ? pageNum : page;

    try {
      setLoading(true);
      setError(null);

      const response = await favoritesService.getUserFavorites(pageToFetch, 12);

      setFavorites(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.number || 0);

      // Build Set of favorite IDs for quick lookup
      const ids = new Set<number>();
      response.content.forEach(listing => {
        ids.add(listing.itemId);
      });
      setFavoriteIds(ids);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Load all favorite IDs on mount for isFavorite checks
  const loadAllFavoriteIds = useCallback(async () => {
    try {
      // Fetch a large page to get all favorite IDs
      const response = await favoritesService.getUserFavorites(0, 1000);
      const ids = new Set<number>();
      response.content.forEach(listing => {
        ids.add(listing.itemId);
      });
      setFavoriteIds(ids);
    } catch (err) {
      // Silently fail - this is just for optimizing isFavorite checks
      // The individual isFavorite API calls will still work
    }
  }, []);

  useEffect(() => {
    // Always try to load favorite IDs for the heart icons (but fail silently if it doesn't work)
    loadAllFavoriteIds();
  }, [loadAllFavoriteIds]);

  const isFavorite = useCallback((itemId: number): boolean => {
    return favoriteIds.has(itemId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (itemId: number) => {
    const wasFavorite = favoriteIds.has(itemId);

    // Optimistic update
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (wasFavorite) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });

    try {
      if (wasFavorite) {
        await favoritesService.removeFavorite(itemId);
      } else {
        await favoritesService.addFavorite(itemId);
      }

      // Reload all favorite IDs
      await loadAllFavoriteIds();
    } catch (err) {
      // Rollback on error
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        if (wasFavorite) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });

      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to toggle favorite');
      throw err; // Re-throw so caller can handle
    }
  }, [favoriteIds, loadAllFavoriteIds]);

  const setPage = useCallback(async (newPage: number) => {
    setPageState(newPage);
    // Fetch immediately with the new page number
    await fetchFavorites(newPage);
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    totalPages,
    currentPage,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
    setPage,
  };
}

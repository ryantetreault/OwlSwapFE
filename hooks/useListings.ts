'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Listing, ListingFilters, Category, PaginatedListingsResponse } from '@/types/listing.types';
import type { ApiError } from '@/types/api.types';

interface UseListingsReturn {
  listings: Listing[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  filters: ListingFilters;
  setFilters: (filters: ListingFilters) => void;
  refreshListings: () => Promise<void>;
  totalPages: number;
  currentPage: number;
}

export function useListings(): UseListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ListingFilters>({ page: 0, size: 6 });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      // Backend returns array of CategoryDto directly, not wrapped in object
      const response = await apiClient.get<Category[]>(
        API_ENDPOINTS.CATEGORIES.ALL,
        true
      );
      setCategories(response || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Backend expects 'keyword' not 'search'
      if (filters.keyword) params.append('keyword', filters.keyword);

      // Backend expects category name as string, not category_id
      if (filters.category) params.append('category', filters.category);

      // Pagination params
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size) params.append('size', filters.size.toString());

      const queryString = params.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.ITEMS.SEARCH}?${queryString}`
        : `${API_ENDPOINTS.ITEMS.ALL}?page=${filters.page || 0}&size=${filters.size || 6}`;

      // Backend returns Page<ItemDto> with Spring pagination structure
      const response = await apiClient.get<PaginatedListingsResponse>(endpoint, true);

      setListings(response.content || []); // Backend uses 'content' not 'items'
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.number || 0);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    categories,
    loading,
    error,
    filters,
    setFilters,
    refreshListings: fetchListings,
    totalPages,
    currentPage,
  };
}

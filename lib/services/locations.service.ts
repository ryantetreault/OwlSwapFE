import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type { Location } from '@/types/listing.types';

export const locationsService = {
  /**
   * Get all available locations
   * Note: Locations don't require authentication
   */
  getAllLocations: async (): Promise<Location[]> => {
    return apiClient.get<Location[]>(
      API_ENDPOINTS.LOCATIONS.ALL,
      false  // Locations don't require auth
    );
  },

  /**
   * Get a specific location by ID
   * @param id - The location ID
   */
  getLocationById: async (id: number): Promise<Location> => {
    return apiClient.get<Location>(
      API_ENDPOINTS.LOCATIONS.BY_ID(id),
      false
    );
  },
};

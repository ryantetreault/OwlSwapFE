import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type { Location, CreateSellerLocationRequest, UpdateSellerLocationRequest } from '@/types/listing.types';

export const locationsService = {
  getAllLocations: async (): Promise<Location[]> => {
    return apiClient.get<Location[]>(API_ENDPOINTS.LOCATIONS.ALL, false);
  },

  getLocationById: async (id: number): Promise<Location> => {
    return apiClient.get<Location>(API_ENDPOINTS.LOCATIONS.BY_ID(id), false);
  },

  getPresetLocations: async (): Promise<Location[]> => {
    return apiClient.get<Location[]>(API_ENDPOINTS.LOCATIONS.PRESET, true);
  },

  getMyAddresses: async (): Promise<Location[]> => {
    return apiClient.get<Location[]>(API_ENDPOINTS.LOCATIONS.MY_ADDRESSES, true);
  },

  getMyAddressById: async (id: number): Promise<Location> => {
    return apiClient.get<Location>(API_ENDPOINTS.LOCATIONS.MY_ADDRESS_BY_ID(id), true);
  },

  createSellerAddress: async (data: CreateSellerLocationRequest): Promise<Location> => {
    return apiClient.post<Location>(API_ENDPOINTS.LOCATIONS.CREATE_SELLER, data, true);
  },

  updateSellerAddress: async (id: number, data: UpdateSellerLocationRequest): Promise<Location> => {
    return apiClient.put<Location>(API_ENDPOINTS.LOCATIONS.UPDATE_SELLER(id), data, true);
  },

  deleteSellerAddress: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.LOCATIONS.DELETE_SELLER(id), true);
  },
};

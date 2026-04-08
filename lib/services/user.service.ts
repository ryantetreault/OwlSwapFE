import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';

export const userService = {
  /**
   * Rate a user (seller) on a scale of 1–5.
   * JWT auth required. Returns 201 on success.
   */
  rateUser: async (userId: number, rating: number): Promise<void> => {
    await apiClient.post<string>(API_ENDPOINTS.USERS.RATE(userId), { rating }, true);
  },
};

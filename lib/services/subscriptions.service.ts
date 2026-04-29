import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type { UserSubscription } from '@/types/subscription.types';

export const subscriptionsService = {
  getUserSubscriptions: async (): Promise<UserSubscription[]> => {
    return apiClient.get<UserSubscription[]>(
      API_ENDPOINTS.USERS.SUBSCRIPTIONS,
      true
    );
  },
};

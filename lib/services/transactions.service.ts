import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type { Transaction, PaginatedTransactionsResponse } from '@/types/transaction.types';

export const transactionsService = {
  /**
   * Get all transactions (admin only, likely)
   */
  getAllTransactions: async (): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>(
      API_ENDPOINTS.TRANSACTIONS.ALL,
      true
    );
  },

  /**
   * Get all transactions where the specified user is the buyer
   * @param buyerId - The ID of the buyer
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  getTransactionsByBuyer: async (buyerId: number, page = 0, size = 6): Promise<PaginatedTransactionsResponse> => {
    return apiClient.get<PaginatedTransactionsResponse>(
      `${API_ENDPOINTS.TRANSACTIONS.BY_BUYER(buyerId)}?page=${page}&size=${size}`,
      true
    );
  },

  /**
   * Get all transactions where the specified user is the seller
   * @param sellerId - The ID of the seller
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  getTransactionsBySeller: async (sellerId: number, page = 0, size = 6): Promise<PaginatedTransactionsResponse> => {
    return apiClient.get<PaginatedTransactionsResponse>(
      `${API_ENDPOINTS.TRANSACTIONS.BY_SELLER(sellerId)}?page=${page}&size=${size}`,
      true
    );
  },

  /**
   * Purchase an item
   * Note: buyerId is extracted from JWT token by the backend
   * @param itemId - The ID of the item to purchase
   */
  purchaseItem: async (itemId: number): Promise<Transaction> => {
    return apiClient.post<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.PURCHASE(itemId),
      undefined,
      true
    );
  },
};

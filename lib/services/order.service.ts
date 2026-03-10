import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type { OrderDto } from '@/types/order.types';

export const orderService = {
  /**
   * Create a new order and reserve the item for the current user (buyer from JWT).
   * Returns an OrderDto with status PENDING and a reservedUntil timestamp.
   */
  createOrder: async (itemId: number): Promise<OrderDto> => {
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.CREATE, { itemId }, true);
  },

  /**
   * Cancel a PENDING order (buyer only). Releases the item back to AVAILABLE.
   */
  cancelOrder: async (orderId: number): Promise<OrderDto> => {
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.CANCEL(orderId), undefined, true);
  },

  /**
   * Mark a PENDING order as paid (buyer only).
   * TEMPORARY — will be replaced by a Stripe webhook when Stripe is integrated.
   */
  payOrder: async (orderId: number): Promise<OrderDto> => {
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.PAY(orderId), undefined, true);
  },

  /**
   * Mark a PAID order as fulfilled (seller only).
   */
  fulfillOrder: async (orderId: number): Promise<OrderDto> => {
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.FULFILL(orderId), undefined, true);
  },
};

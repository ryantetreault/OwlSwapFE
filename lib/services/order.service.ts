import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants';
import type {
  OrderDto,
  PickupCodeResponseDto,
  ConfirmPickupRequest,
  RefundOrderRequestDto,
  RequestRefundRequestDto,
  DecideRefundRequestDto,
  StripeCheckoutSessionDto,
  StripeOnboardingLinkDto,
  StripeSellerStatusDto,
} from '@/types/order.types';

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
   * Seller: generate a pickup code for a PAID order.
   * Returns the code the buyer must present at pickup.
   */
  generatePickupCode: async (orderId: number): Promise<PickupCodeResponseDto> => {
    return apiClient.post<PickupCodeResponseDto>(API_ENDPOINTS.ORDERS.PICKUP_CODE(orderId), undefined, true);
  },

  /**
   * Seller: mark a PAID order as ready for pickup (transitions to READY_FOR_PICKUP).
   */
  markReadyForPickup: async (orderId: number): Promise<OrderDto> => {
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.READY_FOR_PICKUP(orderId), undefined, true);
  },

  /**
   * Buyer: confirm pickup by providing the pickup code (transitions to FULFILLED).
   */
  confirmPickup: async (orderId: number, pickupCode: string): Promise<OrderDto> => {
    const body: ConfirmPickupRequest = { pickupCode };
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.CONFIRM_PICKUP(orderId), body, true);
  },

  /**
   * Seller/admin: directly refund an order via Stripe.
   */
  refundOrder: async (orderId: number, reason: string): Promise<OrderDto> => {
    const body: RefundOrderRequestDto = { reason };
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.REFUND(orderId), body, true);
  },

  /**
   * Buyer: submit a refund request for seller review (transitions to REFUND_REQUESTED).
   */
  requestRefund: async (orderId: number, reason: string): Promise<OrderDto> => {
    const body: RequestRefundRequestDto = { reason };
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.REFUND_REQUEST(orderId), body, true);
  },

  /**
   * Seller: approve a buyer's refund request (issues Stripe refund, transitions to REFUNDED).
   */
  approveRefundRequest: async (orderId: number, decisionReason: string): Promise<OrderDto> => {
    const body: DecideRefundRequestDto = { decisionReason };
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.APPROVE_REFUND(orderId), body, true);
  },

  /**
   * Seller: deny a buyer's refund request (transitions to REFUND_DENIED).
   */
  denyRefundRequest: async (orderId: number, decisionReason: string): Promise<OrderDto> => {
    const body: DecideRefundRequestDto = { decisionReason };
    return apiClient.post<OrderDto>(API_ENDPOINTS.ORDERS.DENY_REFUND(orderId), body, true);
  },

  /**
   * Create a Stripe Checkout session for a PENDING order.
   * Use session.url to redirect the buyer to Stripe.
   */
  createCheckoutSession: async (orderId: number): Promise<StripeCheckoutSessionDto> => {
    return apiClient.post<StripeCheckoutSessionDto>(
      API_ENDPOINTS.ORDERS.CHECKOUT_SESSION(orderId),
      undefined,
      true
    );
  },

  /**
   * Get all orders where the JWT-authenticated user is the buyer.
   */
  getMyPurchases: async (): Promise<OrderDto[]> => {
    return apiClient.get<OrderDto[]>(API_ENDPOINTS.ORDERS.MY_PURCHASES, true);
  },

  /**
   * Get all orders where the JWT-authenticated user is the seller.
   */
  getMySales: async (): Promise<OrderDto[]> => {
    return apiClient.get<OrderDto[]>(API_ENDPOINTS.ORDERS.MY_SALES, true);
  },

  /**
   * Get a Stripe Connect onboarding link for the current seller.
   * Redirects seller to Stripe Express to complete onboarding.
   */
  getStripeOnboardingLink: async (): Promise<string> => {
    const res = await apiClient.post<StripeOnboardingLinkDto>(
      API_ENDPOINTS.STRIPE.ONBOARDING_LINK,
      undefined,
      true
    );
    return res.url;
  },

  /**
   * Get the current seller's Stripe Connect status.
   */
  getStripeSellerStatus: async (): Promise<StripeSellerStatusDto> => {
    return apiClient.get<StripeSellerStatusDto>(API_ENDPOINTS.STRIPE.SELLER_STATUS, true);
  },
};

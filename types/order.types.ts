export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'READY_FOR_PICKUP'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'REFUND_REQUESTED'
  | 'REFUND_DENIED';

export interface OrderDto {
  orderId: number;
  itemId: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  reservedUntil: string | null;
  createdAt: string;
  refundId: string | null;
  refundReason: string | null;
  refundRequestReason: string | null;
  refundDecisionReason: string | null;
  refundedAt: string | null;
  fulfillmentMethod: string | null;
  pickupCodeGeneratedAt: string | null;
  readyForPickupAt: string | null;
  fulfilledAt: string | null;
}

export interface PickupCodeResponseDto {
  orderId: number;
  pickupCode: string;
}

export interface ConfirmPickupRequest {
  pickupCode: string;
}

export interface RefundOrderRequestDto {
  reason: string;
}

export interface RequestRefundRequestDto {
  reason: string;
}

export interface DecideRefundRequestDto {
  decisionReason: string;
}

export interface StripeCheckoutSessionDto {
  sessionId: string;
  url: string;
}

export interface StripeOnboardingLinkDto {
  url: string;
}

export interface StripeSellerStatusDto {
  hasStripeAccount: boolean;
  stripeAccountId: string | null;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

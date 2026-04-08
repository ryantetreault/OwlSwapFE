export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface OrderDto {
  orderId: number;
  itemId: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  /** ISO datetime — only meaningful when status === 'PENDING' */
  reservedUntil: string | null;
  createdAt: string;
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

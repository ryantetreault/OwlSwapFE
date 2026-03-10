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
  reservedUntil: string;
  createdAt: string;
}

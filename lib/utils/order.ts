import type { OrderStatus } from '@/types/order.types';
import type { ApiError } from '@/types/api.types';

/** Returns seconds remaining until reservedUntil. Negative = expired. */
export function secondsUntilExpiry(reservedUntil: string | null): number {
  if (!reservedUntil) return 0;
  return Math.floor((new Date(reservedUntil).getTime() - Date.now()) / 1000);
}

/** readable countdown string: "14:32" */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Label and Tailwind color class for each order status */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; colour: string }
> = {
  PENDING:          { label: 'Pending Payment',  colour: 'text-yellow-600 dark:text-yellow-400' },
  PAID:             { label: 'Paid',             colour: 'text-blue-600 dark:text-blue-400'     },
  READY_FOR_PICKUP: { label: 'Ready for Pickup', colour: 'text-purple-600 dark:text-purple-400' },
  FULFILLED:        { label: 'Fulfilled',        colour: 'text-green-600 dark:text-green-400'   },
  CANCELLED:        { label: 'Cancelled',        colour: 'text-slate-500 dark:text-slate-400'   },
  EXPIRED:          { label: 'Expired',          colour: 'text-red-600 dark:text-red-400'       },
  REFUNDED:         { label: 'Refunded',         colour: 'text-purple-600 dark:text-purple-400' },
};

/** Extract a user-facing error message from an ApiError */
export function extractApiError(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as ApiError).message === 'string'
  ) {
    return (err as ApiError).message;
  }
  return 'Something went wrong. Please try again.';
}

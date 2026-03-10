'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import CountdownTimer from '@/components/CountdownTimer';
import { orderService } from '@/lib/services/order.service';
import type { OrderDto } from '@/types/order.types';
import type { ApiError } from '@/types/api.types';

const PENDING_ORDER_KEY = 'owlswap_pending_order';

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingOrder, setMissingOrder] = useState(false);

  // Load the order from sessionStorage (placed there by the item detail page)
  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
    if (!raw) {
      setMissingOrder(true);
      return;
    }
    try {
      const parsed: OrderDto = JSON.parse(raw);
      if (String(parsed.orderId) !== orderId) {
        setMissingOrder(true);
        return;
      }
      setOrder(parsed);
    } catch {
      setMissingOrder(true);
    }
  }, [orderId]);

  const clearPendingOrder = () => sessionStorage.removeItem(PENDING_ORDER_KEY);

  const handlePay = async () => {
    if (expired || loading) return;
    setLoading(true);
    setError(null);

    try {
      await orderService.payOrder(Number(orderId));
      clearPendingOrder();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err) {
      const apiErr = err as ApiError;
      const msg = apiErr.message ?? '';

      if (msg.toLowerCase().includes('expired')) {
        setExpired(true);
        setError('Your reservation expired before payment could complete. The item is available again.');
      } else if (apiErr.status === 403) {
        setError("You don't have permission to pay this order.");
      } else {
        setError(msg || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      await orderService.cancelOrder(Number(orderId));
      clearPendingOrder();
      router.push('/listings');
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status === 400) {
        setError(apiErr.message || 'This order can no longer be cancelled.');
      } else {
        setError('Could not cancel the order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExpire = () => setExpired(true);

  // Shown when there's no valid order in sessionStorage
  if (missingOrder) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-slate-700 dark:text-slate-300">
            No active order found. Please start a new purchase from the listings page.
          </p>
          <Link
            href="/listings"
            className="px-4 py-2 bg-[#232C64] text-white rounded-lg hover:bg-[#1a2350] transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Complete Your Purchase
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your item is reserved. Pay now before the timer runs out.
            </p>
          </div>

          {/* Order Summary */}
          {order && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Order #</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Item #</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.itemId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Status</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.status}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Total</span>
                <span className="text-2xl font-bold text-[#232C64] dark:text-white">
                  ${order.amount.toFixed(2)} {order.currency}
                </span>
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          {order?.reservedUntil && !expired && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <CountdownTimer reservedUntil={order.reservedUntil} onExpire={handleExpire} />
            </div>
          )}

          {/* Expired notice */}
          {expired && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg px-4 py-3">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Your reservation has expired. The item is available again.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && !expired && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handlePay}
              disabled={loading || expired}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] dark:hover:bg-[#232C64] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>

            {!expired && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel Order
              </button>
            )}

            {expired && (
              <Link
                href="/listings"
                className="w-full text-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Back to Listings
              </Link>
            )}
          </div>

          {/* Stripe note */}
          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            Payment processing is simulated. Stripe integration coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}

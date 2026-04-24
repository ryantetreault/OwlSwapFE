'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import RateSellerModal from '@/components/RateSellerModal';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/lib/services/order.service';
import { ORDER_STATUS_META, extractApiError, secondsUntilExpiry, formatCountdown } from '@/lib/utils/order';
import type { OrderDto } from '@/types/order.types';

const PENDING_POLL_MS = 5000;

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.orderId);

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [role, setRole] = useState<'buyer' | 'seller' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [myPickupCode, setMyPickupCode] = useState<string | null>(null);
  const [sellerCodeInput, setSellerCodeInput] = useState('');

  const fetchOrder = useCallback(async () => {
    const [purchases, sales] = await Promise.all([
      orderService.getMyPurchases().catch(() => [] as OrderDto[]),
      orderService.getMySales().catch(() => [] as OrderDto[]),
    ]);
    const purchase = purchases.find((o) => o.orderId === orderId);
    if (purchase) {
      setOrder(purchase);
      setRole('buyer');
      return;
    }
    const sale = sales.find((o) => o.orderId === orderId);
    if (sale) {
      setOrder(sale);
      setRole('seller');
      return;
    }
    setError('Order not found.');
  }, [orderId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }
    if (!authLoading && user) {
      if (sessionStorage.getItem('verification_pending') === 'true') {
        router.push(`/verify-email-sent?email=${encodeURIComponent(user.email)}`);
        return;
      }
      fetchOrder().catch(() => {
        setError('Failed to load order. Please try again.');
      }).finally(() => setLoading(false));
    }
  }, [user, authLoading, router, fetchOrder]);

  // Auto-poll while order is PENDING or READY_FOR_PICKUP so status updates automatically
  useEffect(() => {
    if (!order || (order.status !== 'PENDING' && order.status !== 'READY_FOR_PICKUP')) return;
    const id = setInterval(fetchOrder, PENDING_POLL_MS);
    return () => clearInterval(id);
  }, [order?.status, fetchOrder]);

  useEffect(() => {
    if (!order) return;
    if (localStorage.getItem(`owlswap_rated_${orderId}`)) setHasRated(true);
  }, [order, orderId]);

  // Countdown timer for PENDING orders
  useEffect(() => {
    if (!order || order.status !== 'PENDING' || !order.reservedUntil) return;
    setCountdown(secondsUntilExpiry(order.reservedUntil));
    const interval = setInterval(() => {
      setCountdown(secondsUntilExpiry(order.reservedUntil!));
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  async function handleResumePay() {
    if (!order) return;
    setActionLoading(true);
    setError(null);
    try {
      const session = await orderService.createCheckoutSession(order.orderId);
      window.location.href = session.url;
    } catch (err) {
      setError(extractApiError(err));
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!order || !confirm('Cancel this order?')) return;
    setActionLoading(true);
    setError(null);
    try {
      const updated = await orderService.cancelOrder(order.orderId);
      setOrder(updated);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMarkReadyForPickup() {
    if (!order) return;
    setActionLoading(true);
    setError(null);
    try {
      const updated = await orderService.markReadyForPickup(order.orderId);
      setOrder(updated);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleGetPickupCode() {
    if (!order) return;
    setActionLoading(true);
    setError(null);
    try {
      const result = await orderService.generatePickupCode(order.orderId);
      setMyPickupCode(result.pickupCode);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirmPickup() {
    if (!order || !sellerCodeInput.trim()) return;
    setActionLoading(true);
    setError(null);
    try {
      const updated = await orderService.confirmPickup(order.orderId, sellerCodeInput.trim());
      setOrder(updated);
      setSellerCodeInput('');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setActionLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link href="/account" className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold border border-[#232C64] text-[#232C64] rounded-lg hover:bg-[#232C64] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white transition-colors">
            &larr; Back to Account
          </Link>
        </main>
      </div>
    );
  }

  if (!order) return null;

  const meta = ORDER_STATUS_META[order.status];
  const backHref = role === 'buyer' ? '/orders/purchases' : '/orders/sales';

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold border border-[#232C64] text-[#232C64] rounded-lg hover:bg-[#232C64] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white transition-colors mb-6"
        >
          &larr; {role === 'buyer' ? 'My Purchases' : 'My Sales'}
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header band */}
          <div className="bg-[#232C64] dark:bg-[#1a2350] px-6 py-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Order #{order.orderId}</h1>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-white/15 ${meta.colour.replace('text-', 'text-white')}`}>
                {meta.label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-6 space-y-5">
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</dt>
                <dd className={`mt-1 text-sm font-semibold ${meta.colour}`}>{meta.label}</dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Amount</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  ${order.amount.toFixed(2)} {order.currency}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Item</dt>
                <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  <Link
                    href={`/listings/${order.itemId}`}
                    className="text-[#232C64] dark:text-blue-400 hover:underline"
                  >
                    View Listing #{order.itemId}
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {role === 'buyer' ? 'Your Role' : 'Your Role'}
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {role}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Placed</dt>
                <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </dd>
              </div>

              {order.status === 'PENDING' && order.reservedUntil && (
                <div>
                  <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Reserved For</dt>
                  <dd className={`mt-1 text-sm font-semibold tabular-nums ${countdown <= 60 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {countdown > 0 ? formatCountdown(countdown) : 'Expired'}
                  </dd>
                </div>
              )}
            </dl>

            {/* Actions */}
            {role === 'buyer' && order.status === 'PENDING' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleResumePay}
                  disabled={actionLoading || countdown <= 0}
                  className="flex-1 px-4 py-2.5 bg-[#232C64] text-white text-sm font-semibold rounded-xl hover:bg-[#1a2350] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading ? 'Redirecting...' : 'Complete Payment'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {role === 'seller' && order.status === 'PENDING' && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setRefreshing(true);
                    const start = Date.now();
                    fetchOrder().finally(() => {
                      const elapsed = Date.now() - start;
                      const remaining = Math.max(0, 600 - elapsed);
                      setTimeout(() => setRefreshing(false), remaining);
                    });
                  }}
                  disabled={refreshing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {refreshing && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {refreshing ? 'Refreshing...' : 'Refresh Status'}
                </button>
              </div>
            )}

            {role === 'buyer' && (order.status === 'READY_FOR_PICKUP' || order.status === 'PAID') && (
              <div className="pt-2 space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {order.status === 'READY_FOR_PICKUP'
                    ? 'Your item is ready for pickup! Generate your code and show it to the seller.'
                    : 'Generate your pickup code to prepare for pickup.'}
                </p>
                {myPickupCode ? (
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-3 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your pickup code</p>
                    <p className="text-2xl font-mono font-bold tracking-widest text-[#232C64] dark:text-white">{myPickupCode}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Show this to the seller</p>
                  </div>
                ) : (
                  <button
                    onClick={handleGetPickupCode}
                    disabled={actionLoading}
                    className="w-full px-4 py-2.5 bg-[#232C64] text-white text-sm font-semibold rounded-xl hover:bg-[#1a2350] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ? 'Generating...' : 'Get Pickup Code'}
                  </button>
                )}
              </div>
            )}

            {role === 'buyer' && order.status === 'FULFILLED' && (
              <div className="pt-2">
                {hasRated ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Seller rated
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Rate Seller
                  </button>
                )}
              </div>
            )}

            {role === 'seller' && order.status === 'PAID' && (
              <div className="pt-2">
                <button
                  onClick={handleMarkReadyForPickup}
                  disabled={actionLoading}
                  className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading ? 'Updating...' : 'Mark Ready for Pickup'}
                </button>
              </div>
            )}

            {role === 'seller' && order.status === 'READY_FOR_PICKUP' && (
              <div className="pt-2 space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ask the buyer for their pickup code and enter it below to complete the handoff.
                </p>
                <input
                  type="text"
                  value={sellerCodeInput}
                  onChange={(e) => setSellerCodeInput(e.target.value)}
                  placeholder="Enter buyer's pickup code"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#232C64]"
                />
                <button
                  onClick={handleConfirmPickup}
                  disabled={actionLoading || !sellerCodeInput.trim()}
                  className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading ? 'Confirming...' : 'Confirm Pickup'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showRatingModal && order && (
        <RateSellerModal
          sellerId={order.sellerId}
          orderId={order.orderId}
          onClose={() => setShowRatingModal(false)}
          onRated={() => setHasRated(true)}
        />
      )}
    </div>
  );
}

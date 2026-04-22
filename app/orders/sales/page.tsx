'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/lib/services/order.service';
import { ORDER_STATUS_META } from '@/lib/utils/order';
import type { OrderDto } from '@/types/order.types';

const PENDING_POLL_MS = 5000;

export default function SalesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = () => {
    orderService
      .getMySales()
      .then(setOrders)
      .catch(() => setError('Failed to load sales. Please try again.'))
      .finally(() => setLoading(false));
  };

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
      router.refresh();
      fetchOrders();

      const handleFocus = () => fetchOrders();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [user, authLoading, router]);

  // Auto-poll while any order is PENDING so status updates when webhook fires
  useEffect(() => {
    const hasPending = orders.some((o) => o.status === 'PENDING');
    if (!hasPending) return;
    const id = setInterval(fetchOrders, PENDING_POLL_MS);
    return () => clearInterval(id);
  }, [orders]);

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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Sales</h1>

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}

        {!error && orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 text-center">
            <p className="text-slate-600 dark:text-slate-400">No sales yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const meta = ORDER_STATUS_META[order.status];
              return (
                <Link
                  key={order.orderId}
                  href={`/orders/${order.orderId}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:border-[#232C64] dark:hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Order #{order.orderId}
                      </span>
                      <span className={`text-sm font-medium ${meta.colour}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Item #{order.itemId} &mdash;{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        ${order.amount.toFixed(2)} {order.currency}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    View details &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

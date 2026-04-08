'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { orderService } from '@/lib/services/order.service';
import type { OrderDto } from '@/types/order.types';

const MAX_POLLS = 10;
const POLL_INTERVAL_MS = 3000;

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get('orderId'));

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    let pollCount = 0;

    async function poll() {
      try {
        const orders = await orderService.getMyPurchases();
        const found = orders.find((o) => o.orderId === orderId);

        if (found?.status === 'PAID' || found?.status === 'FULFILLED') {
          setOrder(found);
          return;
        }
      } catch {
        // ignore polling errors — just keep trying
      }

      pollCount += 1;
      if (pollCount >= MAX_POLLS) {
        setTimedOut(true);
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    // Small initial delay to let the webhook fire
    setTimeout(poll, 1500);
  }, [orderId]);

  if (timedOut && !order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Received</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Your payment was successful. It may take a moment for your order to update.
            </p>
          </div>
          <Link
            href="/orders/purchases"
            className="inline-block w-full text-center px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] transition-all shadow-md hover:shadow-lg"
          >
            View My Purchases
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 space-y-6">
          <div className="flex justify-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Processing Payment...</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Please wait while we confirm your payment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Confirmed!</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Order <span className="font-semibold text-[#232C64] dark:text-blue-400">#{order.orderId}</span> is now{' '}
            <span className="font-semibold capitalize">{order.status.toLowerCase()}</span>.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Amount paid: <span className="font-semibold">${order.amount.toFixed(2)} {order.currency}</span>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The seller will be notified and will fulfill your order shortly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/listings"
            className="flex-1 text-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Browse More
          </Link>
          <Link
            href="/orders/purchases"
            className="flex-1 text-center px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] dark:hover:bg-[#232C64] transition-all shadow-md hover:shadow-lg"
          >
            View My Purchases
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}

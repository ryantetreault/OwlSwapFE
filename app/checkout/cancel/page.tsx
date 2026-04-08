'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { orderService } from '@/lib/services/order.service';
import { extractApiError } from '@/lib/utils/order';

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = Number(searchParams.get('orderId'));

  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    try {
      await orderService.cancelOrder(orderId);
      router.push('/listings');
    } catch (err) {
      setError(extractApiError(err));
      setCancelling(false);
    }
  }

  function handleRetry() {
    router.push(`/checkout/${orderId}`);
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Cancelled</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Your item is still reserved. You can complete your payment or cancel the order.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleRetry}
            className="w-full px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] dark:hover:bg-[#232C64] transition-all shadow-md hover:shadow-lg"
          >
            Try Again
          </button>

          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
        </div>
      }>
        <CheckoutCancelContent />
      </Suspense>
    </div>
  );
}

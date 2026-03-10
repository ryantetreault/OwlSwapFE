'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Payment Confirmed!
            </h1>
            {orderId && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Order <span className="font-semibold text-[#232C64] dark:text-blue-400">#{orderId}</span> is complete.
              </p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
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
              href="/account"
              className="flex-1 text-center px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] dark:hover:bg-[#232C64] transition-all shadow-md hover:shadow-lg"
            >
              View Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}

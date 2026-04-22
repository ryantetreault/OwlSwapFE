'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/lib/services/order.service';
import { extractApiError } from '@/lib/utils/order';
import type { StripeSellerStatusDto } from '@/types/order.types';

export default function StripeSetupPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<StripeSellerStatusDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      orderService
        .getStripeSellerStatus()
        .then(setStatus)
        .catch((err) => setError(extractApiError(err)))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  async function handleConnect() {
    setLinking(true);
    setError(null);
    try {
      const url = await orderService.getStripeOnboardingLink();
      window.location.href = url;
    } catch (err) {
      setError(extractApiError(err));
      setLinking(false);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">

          {status?.onboardingComplete ? (
            <>
              {/* Connected state */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stripe Connected</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                  Your account is set up to receive payments.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                <StatusRow label="Charges enabled" ok={status.chargesEnabled} />
                <StatusRow label="Payouts enabled" ok={status.payoutsEnabled} />
              </div>

              <Link
                href="/listings"
                className="block w-full text-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Back to Listings
              </Link>
            </>
          ) : (
            <>
              {/* Not connected state */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#232C64]/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#232C64] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Connect Stripe to Sell</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                  You need to connect a Stripe account before buyers can purchase your items.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              )}

              <button
                onClick={handleConnect}
                disabled={linking}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] dark:hover:bg-[#232C64] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {linking ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  'Connect Stripe Account'
                )}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      {ok ? (
        <span className="font-semibold text-green-600 dark:text-green-400">Yes</span>
      ) : (
        <span className="font-semibold text-red-500 dark:text-red-400">No</span>
      )}
    </div>
  );
}

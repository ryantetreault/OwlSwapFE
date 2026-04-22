'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/lib/services/order.service';
import { extractApiError } from '@/lib/utils/order';

export default function StripeReauthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/signin');
      return;
    }
    if (sessionStorage.getItem('verification_pending') === 'true') {
      router.push(`/verify-email-sent?email=${encodeURIComponent(user.email)}`);
      return;
    }
    orderService
      .getStripeOnboardingLink()
      .then((url) => {
        window.location.href = url;
      })
      .catch((err) => setError(extractApiError(err)));
  }, [router, user, authLoading]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />
      <div className="flex items-center justify-center h-96">
        {error ? (
          <div className="text-center space-y-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Link
              href="/seller/stripe/setup"
              className="px-4 py-2 bg-[#232C64] text-white rounded-lg hover:bg-[#1a2350] transition-colors"
            >
              Back to Setup
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
            <p className="text-slate-600 dark:text-slate-300">Restarting Stripe setup...</p>
          </div>
        )}
      </div>
    </div>
  );
}

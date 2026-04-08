'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { orderService } from '@/lib/services/order.service';

export default function StripeReturnPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your Stripe account...');

  useEffect(() => {
    orderService.getStripeSellerStatus().then((status) => {
      if (status.onboardingComplete) {
        setMessage('Stripe connected! Redirecting...');
        setTimeout(() => router.push('/seller/stripe/setup'), 1500);
      } else {
        setMessage('Onboarding not complete yet. Redirecting to setup...');
        setTimeout(() => router.push('/seller/stripe/setup'), 2000);
      }
    }).catch(() => {
      router.push('/seller/stripe/setup');
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
          <p className="text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

function VerifyEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();
  const { signOut } = useAuth();
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleContinue = () => {
    sessionStorage.removeItem('verification_pending');
    router.push('/signin');
  };

  const handleResend = async () => {
    if (!email) return;
    setResendStatus('sending');
    try {
      await apiClient.post(
        `${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}?email=${encodeURIComponent(email)}`,
        undefined
      );
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {/* Envelope icon */}
      <div className="w-20 h-20 bg-[#232C64]/10 dark:bg-[#232C64]/30 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-[#232C64] dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Check your inbox</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          We sent a verification email to{' '}
          {email && <span className="font-semibold text-slate-800 dark:text-white">{email}</span>}.
          {' '}Click the link in the email, then come back and sign in.
        </p>
      </div>

      {/* Steps */}
      <ol className="w-full text-left space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <li className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 bg-[#232C64] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          Open the email from Owl Swap in your inbox.
        </li>
        <li className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 bg-[#232C64] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
          Click the verification link inside it.
        </li>
        <li className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 bg-[#232C64] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
          Return here and click the button below to sign in.
        </li>
      </ol>

      {/* Primary CTA */}
      <button
        onClick={handleContinue}
        className="w-full px-6 py-3 bg-[#232C64] text-white rounded-lg hover:bg-[#1a2350] transition-colors font-semibold"
      >
        I&apos;ve verified my email — Sign in
      </button>

      <div className="w-full border-t border-slate-200 dark:border-slate-700" />

      {/* Resend */}
      {resendStatus === 'sent' ? (
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">
          Verification email sent! Check your inbox.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">Didn&apos;t receive it?</p>
          <button
            onClick={handleResend}
            disabled={resendStatus === 'sending'}
            className="text-sm font-medium text-[#232C64] dark:text-blue-400 underline hover:text-[#1a2350] disabled:opacity-60"
          >
            {resendStatus === 'sending' ? 'Sending…' : resendStatus === 'error' ? 'Try again' : 'Resend email'}
          </button>
          {resendStatus === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400">Failed to resend. Please try again.</p>
          )}
        </div>
      )}

      <div className="w-full border-t border-slate-200 dark:border-slate-700" />

      <button
        onClick={signOut}
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        Sign out and use a different account
      </button>
    </div>
  );
}

export default function VerifyEmailSentPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-10 flex flex-col items-center w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#232C64] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <VerifyEmailSentContent />
        </Suspense>
      </div>
      </div>
    </div>
  );
}

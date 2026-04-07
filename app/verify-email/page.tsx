'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuth();

  type Status = 'loading' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('loading');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (user?.email) {
      setResendEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    apiClient
      .get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendStatus('sending');
    setResendError('');
    try {
      await apiClient.post(
        `${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}?email=${encodeURIComponent(resendEmail)}`,
        undefined
      );
      setResendStatus('sent');
    } catch {
      setResendError('Failed to resend. Please try again.');
      setResendStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#232C64] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 dark:text-slate-300">Verifying your email&hellip;</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Email verified!</h2>
        <p className="text-slate-600 dark:text-slate-300">Your account is now fully active. You can buy, sell, and favorite items.</p>
        <Link
          href="/listings"
          className="mt-2 px-6 py-2 bg-[#232C64] text-white rounded-lg hover:bg-[#1a2350] transition-colors font-medium"
        >
          Browse listings &rarr;
        </Link>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center gap-4 text-center w-full max-w-sm">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Link expired</h2>
      <p className="text-slate-600 dark:text-slate-300">This link has expired or has already been used.</p>

      {resendStatus === 'sent' ? (
        <p className="mt-2 text-green-600 dark:text-green-400 font-medium">
          Verification email sent! Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleResend} className="mt-2 w-full flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
            Resend verification email
          </label>
          <input
            type="email"
            required
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#232C64]/30"
          />
          {resendError && (
            <p className="text-sm text-red-600 dark:text-red-400">{resendError}</p>
          )}
          <button
            type="submit"
            disabled={resendStatus === 'sending'}
            className="px-6 py-2 bg-[#232C64] text-white rounded-lg hover:bg-[#1a2350] transition-colors font-medium disabled:opacity-60"
          >
            {resendStatus === 'sending' ? 'Sending…' : 'Resend email'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-10 flex flex-col items-center w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#232C64] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600 dark:text-slate-300">Loading&hellip;</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}

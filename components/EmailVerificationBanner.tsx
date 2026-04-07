"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";

const SESSION_KEY = "email-verification-dismissed";

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [forcedVisible, setForcedVisible] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  // Initialize dismissed state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    setDismissed(stored === "true");
  }, []);

  // Listen for 403/FORBIDDEN events from the API client
  useEffect(() => {
    const handleVerificationRequired = () => {
      sessionStorage.removeItem(SESSION_KEY);
      setDismissed(false);
      setForcedVisible(true);
    };
    window.addEventListener(
      "email-verification-required",
      handleVerificationRequired,
    );
    return () =>
      window.removeEventListener(
        "email-verification-required",
        handleVerificationRequired,
      );
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setDismissed(true);
    setForcedVisible(false);
  };

  const handleResend = async () => {
    if (!user?.email) return;
    setResendStatus("sending");
    try {
      await apiClient.post(
        `${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}?email=${encodeURIComponent(user.email)}`,
        undefined,
      );
      setResendStatus("sent");
    } catch {
      setResendStatus("error");
    }
  };

  // Show only when: user is logged in, not dismissed, and either explicitly unverified
  // (backend returned isEmailVerified: false) or forced by a 403/FORBIDDEN event.
  // When isEmailVerified is undefined (backend doesn't return the field), stay hidden
  // until a 403 event fires.
  if (
    !user ||
    dismissed ||
    (user.isEmailVerified !== false && !forcedVisible)
  ) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 flex-wrap">
        <svg
          className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>

        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex-1 min-w-0">
          Please verify your email to buy, sell, and favorite items.
        </p>

        {resendStatus === "sent" ? (
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Verification email sent!
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendStatus === "sending"}
            className="text-sm font-medium text-yellow-800 dark:text-yellow-200 underline hover:text-yellow-900 dark:hover:text-yellow-100 disabled:opacity-60 whitespace-nowrap"
          >
            {resendStatus === "sending"
              ? "Sending…"
              : resendStatus === "error"
                ? "Try again"
                : "Resend email"}
          </button>
        )}

        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800/40 transition-colors shrink-0"
        >
          <svg
            className="w-4 h-4 text-yellow-700 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

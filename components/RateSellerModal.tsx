'use client';

import { useState } from 'react';
import { userService } from '@/lib/services/user.service';
import { extractApiError } from '@/lib/utils/order';

interface RateSellerModalProps {
  sellerId: number;
  orderId: number;
  onClose: () => void;
  onRated: () => void;
}

export default function RateSellerModal({ sellerId, orderId, onClose, onRated }: RateSellerModalProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!selectedStar) return;
    setSubmitting(true);
    setError(null);
    try {
      await userService.rateUser(sellerId, selectedStar);
      localStorage.setItem(`owlswap_rated_${orderId}`, 'true');
      setSubmitted(true);
      setTimeout(() => {
        onRated();
        onClose();
      }, 1500);
    } catch (err) {
      setError(extractApiError(err));
      setSubmitting(false);
    }
  }

  const activeStar = hoveredStar || selectedStar;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={!submitted ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close button */}
        {!submitted && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Thank you for your feedback!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your rating has been submitted.</p>
            </div>
          </div>
        ) : (
          /* Rating state */
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rate Your Seller</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                How was your experience with this seller?
              </p>
            </div>

            {/* Stars */}
            <div
              className="flex items-center justify-center gap-1"
              onMouseLeave={() => setHoveredStar(0)}
            >
              {[1, 2, 3, 4, 5].map((i) => {
                const fillFraction = Math.min(1, Math.max(0, activeStar - (i - 1)));
                const clipPath = fillFraction >= 1 ? undefined : `inset(0 ${(1 - fillFraction) * 100}% 0 0)`;

                function computeValue(e: React.MouseEvent<HTMLButtonElement>) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const raw = (e.clientX - rect.left) / rect.width;
                  const fraction = Math.max(0.1, Math.min(1.0, raw));
                  return Math.round(((i - 1) + fraction) * 10) / 10;
                }

                return (
                  <button
                    key={i}
                    onMouseMove={(e) => setHoveredStar(computeValue(e))}
                    onClick={(e) => setSelectedStar(computeValue(e))}
                    className="relative p-1 w-12 h-12 transition-transform duration-100 hover:scale-110 focus:outline-none"
                    aria-label={`Rate up to ${i} star${i > 1 ? 's' : ''}`}
                  >
                    {/* Empty base star */}
                    <svg
                      className="absolute inset-0 w-10 h-10 m-1 text-slate-300 dark:text-slate-600"
                      viewBox="0 0 24 24"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {/* Filled amber star clipped to fillFraction */}
                    {fillFraction > 0 && (
                      <svg
                        className="absolute inset-0 w-10 h-10 m-1 text-amber-400 fill-amber-400 transition-all duration-100"
                        viewBox="0 0 24 24"
                        stroke="none"
                        style={{ clipPath }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Label */}
            <p className="text-center text-sm font-medium text-amber-500 dark:text-amber-400 h-5 -mt-2">
              {activeStar > 0 ? `${activeStar.toFixed(1)} / 5.0` : ' '}
            </p>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedStar || submitting}
              className="w-full px-4 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl
                         hover:bg-[#1a2350] dark:hover:bg-[#232C64] transition-all shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Rating'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

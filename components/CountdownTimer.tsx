'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  /** ISO datetime string from the server — source of truth for when reservation expires */
  reservedUntil: string;
  onExpire?: () => void;
}

export default function CountdownTimer({ reservedUntil, onExpire }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(reservedUntil).getTime();

    const tick = () => {
      const diff = Math.floor((target - Date.now()) / 1000);
      if (diff <= 0) {
        setSecondsLeft(0);
        onExpire?.();
      } else {
        setSecondsLeft(diff);
      }
    };

    tick(); // calculate immediately on mount
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [reservedUntil]); // eslint-disable-line react-hooks/exhaustive-deps

  if (secondsLeft === null) return null;

  if (secondsLeft <= 0) {
    return (
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        Reservation expired.
      </p>
    );
  }

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');
  const isUrgent = secondsLeft <= 15;

  return (
    <p className={`text-sm font-medium ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
      Item reserved for:{' '}
      <strong className="font-bold tabular-nums">
        {mins}:{secs}
      </strong>
    </p>
  );
}

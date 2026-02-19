import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition-colors focus:border-[#232C64] focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

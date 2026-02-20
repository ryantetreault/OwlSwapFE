'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types/auth.types';

interface EditProfileFormProps {
  user: User;
  onSave: (data: UpdateProfileData) => Promise<void>;
  onCancel: () => void;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  username: string;
}

export function EditProfileForm({ user, onSave, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 px-4 py-3 rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-all focus:border-[#232C64] focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600"
              placeholder="Enter first name"
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-all focus:border-[#232C64] focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600"
              placeholder="Enter last name"
              required
            />
          </div>
        </div>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <span className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-slate-500">
            @
          </span>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full pl-14 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-all focus:border-[#232C64] focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600"
            placeholder="username"
            required
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your unique identifier on Owl Swap
        </p>
      </div>

      {/* Password Section */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
        </label>
        <button
          type="button"
          onClick={() => {
            // TODO: Implement change password functionality
            alert('Change password functionality coming soon!');
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all hover:border-[#232C64] hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Change Password
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Update your account password
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="submit" variant="primary" isLoading={loading} disabled={loading} className="flex-1 sm:flex-initial">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className="flex-1 sm:flex-initial">
          Cancel
        </Button>
      </div>
    </form>
  );
}

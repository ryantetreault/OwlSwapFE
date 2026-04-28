'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { ListingForm } from '@/components/listings/ListingForm';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Listing } from '@/types/listing.types';

export default function EditListingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const itemId = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }
    if (!authLoading && user) {
      apiClient
        .get<Listing>(API_ENDPOINTS.ITEMS.BY_ID(itemId), true)
        .then((item) => {
          if (item.userId !== user.userId) {
            router.push('/account');
            return;
          }
          setListing(item);
        })
        .catch(() => setError('Failed to load listing.'))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router, itemId]);

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

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-red-600 dark:text-red-400">{error ?? 'Listing not found.'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Listing</h1>
          <ListingForm user={user!} initialListing={listing} mode="edit" />
        </div>
      </main>
    </div>
  );
}

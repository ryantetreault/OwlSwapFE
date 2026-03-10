'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { orderService } from '@/lib/services/order.service';
import type { Listing } from '@/types/listing.types';
import type { ApiError } from '@/types/api.types';

const PENDING_ORDER_KEY = 'owlswap_pending_order';

function getImageSrc(image: Listing['images'][0]): string {
  if (typeof image.image_date === 'string') {
    return `data:${image.image_type};base64,${image.image_date}`;
  }
  const bytes = new Uint8Array(image.image_date);
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  return `data:${image.image_type};base64,${btoa(binary)}`;
}

function ListingStatusBadge({ listing }: { listing: Listing }) {
  const status = listing.listingStatus;

  if (status === 'RESERVED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
        <span className="w-2 h-2 rounded-full bg-current" />
        Currently Reserved
      </span>
    );
  }

  if (status === 'SOLD' || !listing.available) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
        <span className="w-2 h-2 rounded-full bg-current" />
        Sold
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      Available
    </span>
  );
}

export default function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<Listing>(
          API_ENDPOINTS.ITEMS.BY_ID(Number(itemId)),
          true,
        );
        setListing(data);
      } catch (err) {
        setFetchError('Could not load this listing. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchListing();
  }, [itemId]);

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (!listing) return;

    setBuyLoading(true);
    setBuyError(null);

    try {
      const order = await orderService.createOrder(listing.itemId);
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order));
      router.push(`/checkout/${order.orderId}`);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status === 409) {
        setBuyError('This item was just reserved by someone else. Try again shortly.');
      } else if (apiErr.status === 403) {
        setBuyError("You can't purchase your own listing.");
      } else {
        setBuyError(apiErr.message || 'Could not start purchase. Please try again.');
      }
    } finally {
      setBuyLoading(false);
    }
  };

  const isOwnListing = user && listing && user.userId === listing.userId;
  const isAvailable =
    listing?.listingStatus === 'AVAILABLE' ||
    (listing?.listingStatus === undefined && listing?.available === true);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent" />
            <p className="text-slate-600 dark:text-slate-300">Loading listing...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !listing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-slate-600 dark:text-slate-300">{fetchError ?? 'Listing not found.'}</p>
          <Link
            href="/listings"
            className="px-4 py-2 bg-[#232C64] text-white rounded-lg hover:bg-[#1a2350] transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const hasImages = listing.images && listing.images.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-[#232C64] dark:hover:text-white mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listings
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="bg-slate-100 dark:bg-slate-900">
              {hasImages ? (
                <div>
                  <div className="relative h-80 md:h-full min-h-80 overflow-hidden">
                    <img
                      src={getImageSrc(listing.images[activeImageIndex])}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {listing.images.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto">
                      {listing.images.map((image, index) => (
                        <button
                          key={image.imageId}
                          onClick={() => setActiveImageIndex(index)}
                          className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === activeImageIndex
                              ? 'border-[#232C64]'
                              : 'border-transparent hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={getImageSrc(image)}
                            alt={`${listing.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 md:h-full min-h-80">
                  <svg
                    className="w-24 h-24 text-slate-300 dark:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 flex flex-col gap-4">
              {/* Title & Status */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {listing.name}
                </h1>
                <ListingStatusBadge listing={listing} />
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-[#232C64] dark:text-blue-400">
                ${listing.price.toFixed(2)}
              </p>

              {/* Category & Type */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#232C64]/10 text-[#232C64] dark:bg-blue-400/10 dark:text-blue-400">
                  {listing.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {listing.itemType}
                </span>
                {listing.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Description
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Listed date */}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Listed on{' '}
                {new Date(listing.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              {/* Buy Now Section */}
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                {isOwnListing ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    This is your listing.
                  </p>
                ) : isAvailable ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleBuyNow}
                      disabled={buyLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white font-semibold rounded-xl hover:bg-[#1a2350] dark:hover:bg-[#232C64] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                      {buyLoading ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Reserving...
                        </>
                      ) : (
                        'Buy Now'
                      )}
                    </button>
                    {buyError && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {buyError}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    {listing.listingStatus === 'RESERVED'
                      ? 'This item is currently reserved by another buyer.'
                      : 'This item is no longer available.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

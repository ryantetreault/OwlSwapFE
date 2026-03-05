"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { ListingCard } from "@/components/listings/ListingCard";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import Header from "@/components/Header";

export default function FavoritesPage() {
  const {
    favorites,
    loading,
    error,
    totalPages,
    currentPage,
    isFavorite,
    toggleFavorite,
    setPage,
    refreshFavorites,
  } = useFavorites();

  // Fetch favorites when the page loads
  useEffect(() => {
    refreshFavorites().catch(err => {
      console.error('Failed to load favorites:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = async (newPage: number) => {
    try {
      await setPage(newPage);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to change page:', err);
    }
  };

  const handleToggleFavorite = async (itemId: number) => {
    try {
      await toggleFavorite(itemId);
      // Refresh the favorites list after toggling
      await refreshFavorites();
    } catch (err) {
      // Error is already handled in the hook
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Items you've saved for later
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent"></div>
              <p className="text-slate-600 dark:text-slate-300">
                Loading favorites...
              </p>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <svg
              className="w-20 h-20 mx-auto text-slate-400 dark:text-slate-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Browse listings and click the heart icon to save items to your favorites for easy access later.
            </p>
            <Link href="/listings">
              <Button>Browse Listings</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {favorites.length}{" "}
                {favorites.length === 1 ? "favorite" : "favorites"}
              </p>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((listing) => (
                <ListingCard
                  key={listing.itemId}
                  listing={listing}
                  isFavorite={isFavorite(listing.itemId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

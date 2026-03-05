"use client";

import React from "react";
import Link from "next/link";
import { useListings } from "@/hooks/useListings";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/listings/SearchBar";
import { CategoryFilter } from "@/components/listings/CategoryFilter";
import { ListingCard } from "@/components/listings/ListingCard";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import Header from "@/components/Header";

export default function ListingsPage() {
  const { listings, categories, loading, error, filters, setFilters, totalPages, currentPage } =
    useListings();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = (query: string) => {
    setFilters({ ...filters, keyword: query, page: 0 }); // Backend expects 'keyword'
  };

  const handleCategoryChange = (categoryName: string | undefined) => {
    setFilters({ ...filters, category: categoryName, page: 0 }); // Backend expects category name
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async (itemId: number) => {
    try {
      await toggleFavorite(itemId);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          {/* Header with Create Listing Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Browse Listings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Discover items, services, and requests from the community
              </p>
            </div>
            <Link
              href="/create-listing"
              className="flex items-center gap-2 px-6 py-3 bg-[#232C64] dark:bg-[#2d3a7a] text-white rounded-lg hover:bg-[#1a2350] dark:hover:bg-[#232C64] transition-all shadow-md hover:shadow-lg whitespace-nowrap"
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
                <path d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-semibold">Create Listing</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <CategoryFilter
              categories={categories}
              selectedCategory={filters.category}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#232C64] border-t-transparent"></div>
              <p className="text-slate-600 dark:text-slate-300">
                Loading listings...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {listings.length}{" "}
                {listings.length === 1 ? "listing" : "listings"} found
                {filters.keyword && (
                  <span className="ml-1">
                    for &quot;
                    <span className="font-semibold">{filters.keyword}</span>
                    &quot;
                  </span>
                )}
              </p>
            </div>

            {/* Listings Grid with Favorites */}
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  No listings found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.itemId}
                    listing={listing}
                    isFavorite={isFavorite(listing.itemId)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

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

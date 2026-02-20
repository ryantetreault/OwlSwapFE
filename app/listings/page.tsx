"use client";

import React from "react";
import { useListings } from "@/hooks/useListings";
import { SearchBar } from "@/components/listings/SearchBar";
import { CategoryFilter } from "@/components/listings/CategoryFilter";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import Header from "@/components/Header";

export default function ListingsPage() {
  const { listings, categories, loading, error, filters, setFilters } =
    useListings();

  const handleSearch = (query: string) => {
    setFilters({ ...filters, keyword: query, page: 0 }); // Backend expects 'keyword'
  };

  const handleCategoryChange = (categoryName: string | undefined) => {
    setFilters({ ...filters, category: categoryName, page: 0 }); // Backend expects category name
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
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

            <ListingGrid listings={listings} />
          </>
        )}
      </main>
    </div>
  );
}

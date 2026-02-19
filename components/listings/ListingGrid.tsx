import React from "react";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/types/listing.types";

interface ListingGridProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
}

export function ListingGrid({ listings, onListingClick }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No listings found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.itemId}
          listing={listing}
          onClick={onListingClick ? () => onListingClick(listing) : undefined}
        />
      ))}
    </div>
  );
}

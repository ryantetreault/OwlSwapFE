import React from "react";
import { Card } from "@/components/ui/Card";
import type { Listing } from "@/types/listing.types";

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(listing.price);

  const formattedDate = new Date(listing.releaseDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );

  // Convert first image from byte array to base64 for display
  const getImageSrc = () => {
    if (listing.images && listing.images.length > 0) {
      const firstImage = listing.images[0];
      // Jackson serializes byte[] as base64 string; fall back to number[] handling
      if (typeof firstImage.image_date === "string") {
        return `data:${firstImage.image_type};base64,${firstImage.image_date}`;
      }
      const bytes = new Uint8Array(firstImage.image_date);
      const binary = bytes.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        "",
      );
      const base64 = btoa(binary);
      return `data:${firstImage.image_type};base64,${base64}`;
    }
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <Card onClick={onClick}>
      <div className="mb-4 h-48 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={listing.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-[#232C64] dark:text-white">
            {listing.name}
          </h3>
          <span className="text-lg font-bold text-[#232C64] dark:text-blue-400">
            {formattedPrice}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {listing.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="rounded-full bg-[#232C64]/10 px-3 py-1 text-xs font-medium text-[#232C64] dark:bg-blue-400/10 dark:text-blue-400">
            {listing.category || "Uncategorized"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formattedDate}
          </span>
        </div>

        {!listing.available && (
          <div className="rounded-lg bg-red-50 px-3 py-1 text-center dark:bg-red-900/20">
            <span className="text-xs font-medium text-red-800 dark:text-red-400">
              Unavailable
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

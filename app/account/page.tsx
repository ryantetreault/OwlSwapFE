"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  EditProfileForm,
  UpdateProfileData,
} from "@/components/EditProfileForm";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { transactionsService } from "@/lib/services/transactions.service";
import type { Listing } from "@/types/listing.types";

interface Purchase {
  purchaseId: number;
  itemName: string;
  price: number;
  purchaseDate: string;
  sellerId: number;
  sellerName: string;
}

interface Rating {
  ratingId: number;
  rating: number;
  comment: string;
  raterName: string;
  date: string;
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "listings" | "purchases" | "ratings"
  >("overview");
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    } else if (user) {
      loadAccountData();
    }
  }, [user, authLoading, router]);

  const loadAccountData = async () => {
    try {
      setLoading(true);

      // Load user's listings using the owner endpoint
      try {
        if (user?.userId) {
          const listingsResponse = await apiClient.get<{ content: Listing[] }>(
            `${API_ENDPOINTS.ITEMS.BY_OWNER(user.userId)}?size=100`,
            true,
          );
          setUserListings(listingsResponse.content);
        }
      } catch (error) {
        console.error("Error loading listings:", error);
      }

      // Load purchases (transactions where user is buyer)
      try {
        if (user?.userId) {
          const transactionsResponse =
            await transactionsService.getTransactionsByBuyer(
              user.userId,
              0,
              100,
            );

          const purchaseData = transactionsResponse.content.map((t) => ({
            purchaseId: t.transactionId,
            itemName: t.item.name,
            price: t.item.price,
            purchaseDate: t.transactionDate || new Date().toISOString(),
            sellerId: t.seller.userId,
            sellerName: `${t.seller.firstName} ${t.seller.lastName}`,
          }));
          setPurchases(purchaseData);
        }
      } catch (error) {
        console.error("Error loading purchases:", error);
        setPurchases([]);
      }

      // TODO: Load ratings when backend endpoint is available
      // Placeholder data for now
      setRatings([]);
    } catch (error) {
      console.error("Error loading account data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: UpdateProfileData) => {
    // TODO: Implement profile update functionality
    console.log("Profile update requested:", data);
    alert("Profile update functionality coming soon!");
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleViewListing = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleEditListing = (itemId: number) => {
    // TODO: Create edit listing page
    alert("Edit listing functionality coming soon!");
    console.log("Edit listing:", itemId);
  };

  const handleDeleteListing = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await apiClient.delete(API_ENDPOINTS.ITEMS.DELETE(itemId), true);
      setUserListings(userListings.filter((l) => l.itemId !== itemId));
      setSelectedListing(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    }
  };

  const closeModal = () => {
    setSelectedListing(null);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          {!isEditingProfile ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#232C64] rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      @{user.username}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#232C64] dark:bg-[#2d3a7a] rounded-lg hover:bg-[#1a2350] dark:hover:bg-[#232C64] transition-all shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>

              {/* Rating Display */}
              {user.averageRating !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {user.averageRating.toFixed(1)}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Rating
                  </span>
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-linear-to-r from-[#232C64] to-[#2d3a7a] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Edit Profile
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Update your personal information
                  </p>
                </div>
              </div>
              <EditProfileForm
                user={user}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-[#232C64] text-[#232C64] dark:text-white"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("listings")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "listings"
                    ? "border-[#232C64] text-[#232C64] dark:text-white"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                My Listings ({userListings.length})
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "purchases"
                    ? "border-[#232C64] text-[#232C64] dark:text-white"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Purchases ({purchases.length})
              </button>
              <button
                onClick={() => setActiveTab("ratings")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "ratings"
                    ? "border-[#232C64] text-[#232C64] dark:text-white"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Ratings ({ratings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                Loading...
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Active Listings
                        </h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                          {userListings.filter((l) => l.available).length}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Total Purchases
                        </h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                          {purchases.length}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Ratings Received
                        </h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                          {ratings.length}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Account Information
                      </h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-slate-600 dark:text-slate-400">
                            Username:
                          </dt>
                          <dd className="text-slate-900 dark:text-white">
                            @{user.username}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600 dark:text-slate-400">
                            Email:
                          </dt>
                          <dd className="text-slate-900 dark:text-white">
                            {user.email}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600 dark:text-slate-400">
                            Average Rating:
                          </dt>
                          <dd className="text-slate-900 dark:text-white">
                            {user.averageRating !== null
                              ? `★ ${user.averageRating.toFixed(1)}`
                              : "No ratings yet"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}

                {/* Listings Tab */}
                {activeTab === "listings" && (
                  <div>
                    {userListings.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-linear-to-br from-[#232C64] to-[#2d3a7a] rounded-full flex items-center justify-center mb-4 shadow-lg">
                          <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          No Listings Yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                          You haven't created any listings yet. Start selling
                          today!
                        </p>
                        <button
                          onClick={() => router.push("/create-listing")}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#232C64] to-[#2d3a7a] text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
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
                          Create Your First Listing
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {userListings.map((listing) => {
                          const getImageSrc = () => {
                            if (listing.images && listing.images.length > 0) {
                              const firstImage = listing.images[0];
                              // Jackson serializes byte[] as base64 string; fall back to number[] handling
                              if (typeof firstImage.image_date === "string") {
                                return `data:${firstImage.image_type};base64,${firstImage.image_date}`;
                              }
                              const bytes = new Uint8Array(
                                firstImage.image_date,
                              );
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
                            <div
                              key={listing.itemId}
                              className="group bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-600 hover:border-[#232C64] dark:hover:border-[#2d3a7a]"
                            >
                              {/* Image Section */}
                              <div
                                className="relative h-32 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 cursor-pointer overflow-hidden"
                                onClick={() => handleViewListing(listing)}
                              >
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={listing.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <svg
                                      className="w-10 h-10 text-slate-400 dark:text-slate-500"
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
                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
                                      listing.available
                                        ? "bg-green-500/90 text-white"
                                        : "bg-red-500/90 text-white"
                                    }`}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                    {listing.available ? "Available" : "Sold"}
                                  </span>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="p-3">
                                <div
                                  className="cursor-pointer mb-3"
                                  onClick={() => handleViewListing(listing)}
                                >
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#232C64] dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                                    {listing.name}
                                  </h4>
                                  <div className="flex items-center justify-between">
                                    <span className="text-base font-bold bg-linear-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                                      ${listing.price.toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                      </svg>
                                      {listing.category}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                      {listing.itemType}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      •{" "}
                                      {new Date(
                                        listing.releaseDate,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-1.5 pt-2.5 border-t border-slate-200 dark:border-slate-600">
                                  <button
                                    onClick={() =>
                                      handleEditListing(listing.itemId)
                                    }
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-500 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteListing(listing.itemId)
                                    }
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-rose-400 to-red-500 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Purchases Tab */}
                {activeTab === "purchases" && (
                  <div>
                    {purchases.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">
                          No purchase history yet.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                          This section will show items you've purchased.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {purchases.map((purchase) => (
                          <div
                            key={purchase.purchaseId}
                            className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {purchase.itemName}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Seller: {purchase.sellerName}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                  {new Date(
                                    purchase.purchaseDate,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-lg font-bold text-[#232C64] dark:text-white">
                                ${purchase.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Ratings Tab */}
                {activeTab === "ratings" && (
                  <div>
                    {ratings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">
                          No ratings received yet.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                          This section will show ratings from buyers.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ratings.map((rating) => (
                          <div
                            key={rating.ratingId}
                            className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-yellow-500">
                                {"★".repeat(rating.rating)}
                                {"☆".repeat(5 - rating.rating)}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                by {rating.raterName}
                              </span>
                            </div>
                            <p className="text-slate-900 dark:text-white">
                              {rating.comment}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              {new Date(rating.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Listing Details Modal */}
      {selectedListing && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {selectedListing.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {selectedListing.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedListing.available
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {selectedListing.available ? "Available" : "Sold"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Images */}
              {selectedListing.images && selectedListing.images.length > 0 && (
                <div className="mb-6">
                  <div
                    className={`grid gap-3 ${selectedListing.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                  >
                    {selectedListing.images.map((image, index) => {
                      let imageSrc: string;
                      if (typeof image.image_date === "string") {
                        imageSrc = `data:${image.image_type};base64,${image.image_date}`;
                      } else {
                        const bytes = new Uint8Array(image.image_date);
                        const binary = bytes.reduce(
                          (acc, byte) => acc + String.fromCharCode(byte),
                          "",
                        );
                        const base64 = btoa(binary);
                        imageSrc = `data:${image.image_type};base64,${base64}`;
                      }

                      return (
                        <div
                          key={index}
                          className="relative overflow-hidden rounded-xl group"
                        >
                          <img
                            src={imageSrc}
                            alt={`${selectedListing.name} ${index + 1}`}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-linear-to-r from-[#232C64]/5 to-[#2d3a7a]/5 dark:from-[#232C64]/20 dark:to-[#2d3a7a]/20 rounded-xl p-6 mb-6 border border-[#232C64]/20">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold bg-linear-to-r from-[#232C64] to-[#2d3a7a] bg-clip-text text-transparent">
                    ${selectedListing.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Listed on{" "}
                  {new Date(selectedListing.releaseDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
                  Description
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedListing.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">
                    Type
                  </h3>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedListing.itemType}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">
                    Category
                  </h3>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedListing.category}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleEditListing(selectedListing.itemId)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-[#232C64] to-[#2d3a7a] rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Listing
                </button>
                <button
                  onClick={() => handleDeleteListing(selectedListing.itemId)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-red-600 to-red-700 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

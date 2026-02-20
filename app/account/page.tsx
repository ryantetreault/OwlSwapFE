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

      // Load user's listings
      // For now, we'll fetch all listings and filter client-side
      // TODO: Update when backend supports filtering by userId
      try {
        const listingsResponse = await apiClient.get<{ content: Listing[] }>(
          `${API_ENDPOINTS.ITEMS.ALL}?size=100`,
          true,
        );
        const myListings = listingsResponse.content.filter(
          (listing) => listing.userId === user?.userId,
        );
        setUserListings(myListings);
      } catch (error) {
        console.error("Error loading listings:", error);
      }

      // TODO: Load purchases when backend endpoint is available
      // Placeholder data for now
      setPurchases([]);

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
    console.log('Profile update requested:', data);
    alert('Profile update functionality coming soon!');
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
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
                      <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">
                          You haven't created any listings yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userListings.map((listing) => (
                          <div
                            key={listing.itemId}
                            className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                              {listing.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                              {listing.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-[#232C64] dark:text-white">
                                ${listing.price.toFixed(2)}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  listing.available
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                              >
                                {listing.available ? "Available" : "Sold"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              {listing.category} • {listing.itemType}
                            </p>
                          </div>
                        ))}
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
    </div>
  );
}

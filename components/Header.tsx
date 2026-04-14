'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
      setIsAnimating(false);
    }, 200); // Match animation duration
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    // Small delay to allow the DOM to render before starting animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const handleAccountClick = () => {
    router.push('/account');
    closeMenu();
  };

  const handleCreateListingClick = () => {
    router.push('/create-listing');
    closeMenu();
  };

  const handleFavoritesClick = () => {
    router.push('/favorites');
    closeMenu();
  };

  const handlePurchasesClick = () => {
    router.push('/orders/purchases');
    closeMenu();
  };

  const handleSalesClick = () => {
    router.push('/orders/sales');
    closeMenu();
  };

  const handleHomeClick = () => {
    router.push('/listings');
    closeMenu();
  };

  const handleSellerSetupClick = () => {
    router.push('/seller/stripe/setup');
    closeMenu();
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link href="/listings" className="flex items-center gap-3 group">
            <Image
              src="/OwlSwapLogo-Transparent.png"
              alt="Owl Swap Logo"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-110"
            />
            <h1 className="text-2xl font-bold text-[#232C64] dark:text-white">
              Owl Swap
            </h1>
          </Link>

          {/* User info and burger menu */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
                Welcome, {user.firstName} {user.lastName}
              </span>
            )}

            {/* Burger Menu Button */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#232C64]/20"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-slate-700 dark:text-slate-300"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className={`fixed inset-0 z-10 transition-opacity duration-200 ${
                      isAnimating && !isClosing ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={closeMenu}
                  />

                  {/* Menu */}
                  <div className={`absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden transition-all duration-200 origin-top-right ${
                    isAnimating && !isClosing
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2'
                  }`}>
                    {/* User Info Section */}
                    {user && (
                      <div className="px-4 py-3 bg-linear-to-r from-[#232C64] to-[#2d3a7a] dark:from-[#1a2350] dark:to-[#232C64]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="text-sm font-bold text-white">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-white/80 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleHomeClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Browse Listings</span>
                      </button>

                      <button
                        onClick={handleCreateListingClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Listing</span>
                      </button>

                      <button
                        onClick={handleFavoritesClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>My Favorites</span>
                      </button>

                      <button
                        onClick={handlePurchasesClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>My Purchases</span>
                      </button>

                      <button
                        onClick={handleSalesClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>My Sales</span>
                      </button>

                      <button
                        onClick={handleSellerSetupClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Seller Setup</span>
                      </button>

                      <button
                        onClick={handleAccountClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#232C64] dark:group-hover:text-white transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Account</span>
                      </button>

                      {/* Divider */}
                      <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                      >
                        <svg
                          className="w-5 h-5 text-red-500 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

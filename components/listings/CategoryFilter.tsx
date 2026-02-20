'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Category } from '@/types/listing.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | undefined; // Backend uses category name, not ID
  onCategoryChange: (categoryName: string | undefined) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsAnimating(false);
    }, 200);
  };

  const openDropdown = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleCategorySelect = (categoryName: string | undefined) => {
    onCategoryChange(categoryName);
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          closeDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayText = selectedCategory || 'All Categories';

  return (
    <div className="relative w-full md:w-64" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all hover:border-[#232C64] focus:border-[#232C64] focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-blue-400 dark:focus:border-blue-400"
      >
        <span className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-slate-500 dark:text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {displayText}
        </span>
        <svg
          className={`h-5 w-5 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Menu */}
          <div
            className={`absolute z-30 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 origin-top dark:border-slate-700 dark:bg-slate-800 ${
              isAnimating && !isClosing
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2'
            }`}
          >
            <div className="max-h-80 overflow-y-auto py-2">
              {/* All Categories Option */}
              <button
                onClick={() => handleCategorySelect(undefined)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-[#232C64] text-white dark:bg-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    !selectedCategory ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>All Categories</span>
                {!selectedCategory && (
                  <svg
                    className="ml-auto h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Divider */}
              {categories.length > 0 && (
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
              )}

              {/* Category Options */}
              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-all ${
                    selectedCategory === category.name
                      ? 'bg-[#232C64] text-white dark:bg-blue-600'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <svg
                    className={`h-5 w-5 ${
                      selectedCategory === category.name
                        ? 'text-white'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{category.name}</span>
                  {selectedCategory === category.name && (
                    <svg
                      className="ml-auto h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

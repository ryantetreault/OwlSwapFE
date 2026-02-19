'use client';

import React from 'react';
import type { Category } from '@/types/listing.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | undefined; // Backend uses category name, not ID
  onCategoryChange: (categoryName: string | undefined) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full md:w-auto">
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value || undefined)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-[#232C64] focus:outline-none focus:ring-2 focus:ring-[#232C64]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.categoryId} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

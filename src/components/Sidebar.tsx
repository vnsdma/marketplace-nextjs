'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../types/marketplace';
import {
  LayoutGrid,
  Laptop,
  Car,
  Home,
  Shirt,
  Bike,
  Gamepad2,
  Flower2,
  Building,
  Gift,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  const renderCategoryIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 ${isSelected ? 'text-[#1877F2]' : 'text-gray-600'}`;
    switch (iconName) {
      case 'Laptop': return <Laptop className={iconClass} />;
      case 'Car': return <Car className={iconClass} />;
      case 'Home': return <Home className={iconClass} />;
      case 'Shirt': return <Shirt className={iconClass} />;
      case 'Bike': return <Bike className={iconClass} />;
      case 'Gamepad2': return <Gamepad2 className={iconClass} />;
      case 'Flower2': return <Flower2 className={iconClass} />;
      case 'Building': return <Building className={iconClass} />;
      case 'Gift': return <Gift className={iconClass} />;
      default: return <LayoutGrid className={iconClass} />;
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-5">
      {/* Quick Action Button */}
      <Link
        href="/create"
        className="w-full py-2.5 px-3 bg-[#e7f3ff] hover:bg-[#d8ecff] text-[#1877F2] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>+ Create New Listing</span>
      </Link>

      {/* Sorting Filter */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <span>Sort By</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort listings by price or date"
          className="w-full text-xs py-2 px-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1877F2] text-gray-800 font-medium cursor-pointer"
        >
          <option value="newest">Date: Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories Section */}
      <div className="pt-2 border-t border-gray-100">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 px-1">
          Categories
        </h2>
        <nav className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-[#e7f3ff] text-[#1877F2] font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-white shadow-2xs' : 'bg-gray-100'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName, isSelected)}
                </div>
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

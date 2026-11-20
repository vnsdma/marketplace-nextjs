'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Plus, Search, MapPin } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group text-decoration-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs group-hover:bg-[#166fe5] transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-gray-900 group-hover:text-[#1877F2] transition-colors">
                Marketplace
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-gray-500 ml-2 py-0.5 px-1.5 bg-gray-100 rounded-md">
                Facebook Demo
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar in Header */}
        {onSearchChange !== undefined && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Marketplace listings..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 hover:bg-gray-200/70 focus:bg-white border border-transparent focus:border-[#1877F2] rounded-full focus:outline-none transition-all placeholder:text-gray-500"
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-200">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span>Palo Alto, CA • within 40 mi</span>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

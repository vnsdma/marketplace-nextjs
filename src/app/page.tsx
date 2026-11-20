'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Listing } from '../types/marketplace';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SEED_LISTINGS } from '../lib/mockData';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ListingCard } from '../components/ListingCard';
import { CATEGORIES } from '../types/marketplace';
import { Search, Loader2, Sparkles, FilterX } from 'lucide-react';

export default function MarketplaceHomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load listings from Supabase (with fallback to seed)
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setListings(data as Listing[]);
          return;
        }
      }

      // Check localStorage for user-created listings
      const saved = localStorage.getItem('fb_marketplace_listings_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setListings(parsed);
            return;
          }
        } catch {
          // ignore
        }
      }

      // Default to initial seed listings
      setListings(SEED_LISTINGS);
      localStorage.setItem('fb_marketplace_listings_v1', JSON.stringify(SEED_LISTINGS));
    } catch (err) {
      console.warn('Error fetching listings:', err);
      setListings(SEED_LISTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Filtered and sorted listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Category filter
        const matchesCat =
          selectedCategory === 'all' ||
          item.category.toLowerCase() === selectedCategory.toLowerCase();

        // Search filter (title or description)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          item.location.toLowerCase().includes(q);

        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        // Default: newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [listings, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col justify-between">
      <div>
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile Search input */}
          <div className="mb-4 block md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Marketplace listings..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#1877F2]"
              />
            </div>
          </div>

          {/* Quick Category Chips for Touch Devices */}
          <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#1877F2] text-white shadow-2xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Layout: Sidebar + Feed */}
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block shrink-0">
              <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Right Main Grid */}
            <div className="flex-1 w-full min-w-0">
              {/* Feed Header Banner */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>
                      {selectedCategory === 'all'
                        ? "Today's Picks"
                        : `${selectedCategory} in Palo Alto, CA`}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing {filteredListings.length} listing{filteredListings.length === 1 ? '' : 's'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>

                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#1877F2] hover:underline font-semibold"
                  >
                    <FilterX className="w-3.5 h-3.5" />
                    <span>Clear all filters</span>
                  </button>
                )}
              </div>

              {/* Feed Content */}
              {isLoading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-8 h-8 text-[#1877F2] animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Loading marketplace deals...</p>
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredListings.map((item) => (
                    <ListingCard key={item.id} listing={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">No listings found</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    We couldn&apos;t find any items matching your criteria. Try adjusting your search query or selecting a different category.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 space-y-1">
          <p>Facebook Marketplace Demo • Built for Test 3: Marketplace Challenge</p>
          <p className="text-[11px] text-gray-400">Next.js 15 • React 19 • Supabase Postgres & Storage • Vercel</p>
        </div>
      </footer>
    </div>
  );
}

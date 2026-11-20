'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Listing } from '../../../types/marketplace';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { SEED_LISTINGS } from '../../../lib/mockData';
import { Header } from '../../../components/Header';
import { MessageSellerModal } from '../../../components/MessageSellerModal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Share2,
  Check,
  ShieldCheck,
  MessageCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

function ListingDetailContent() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadListing() {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('id', id)
            .single();

          if (!error && data) {
            setListing(data as Listing);
            setIsLoading(false);
            return;
          }
        }

        // Check localStorage cache
        const saved = localStorage.getItem('fb_marketplace_listings_v1');
        if (saved) {
          try {
            const parsed: Listing[] = JSON.parse(saved);
            const found = parsed.find((item) => item.id === id);
            if (found) {
              setListing(found);
              setIsLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }

        // Check seed listings
        const seedFound = SEED_LISTINGS.find((item) => item.id === id);
        if (seedFound) {
          setListing(seedFound);
        }
      } catch (err) {
        console.warn('Error loading listing:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadListing();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#1877F2] animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500">Loading item details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-lg font-bold text-gray-900 mb-2">Listing Not Found</h1>
        <p className="text-xs text-gray-500 mb-6">
          This item may have been sold or removed by the seller.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-lg shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.price);

  const formattedDate = new Date(listing.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Back navigation */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1877F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Product Details Layout */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Large Photo (7 cols) */}
        <div className="lg:col-span-7 bg-black/95 flex items-center justify-center p-4 min-h-[400px] lg:min-h-[560px]">
          {listing.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.image_url}
              alt={listing.title}
              className="max-h-[500px] w-auto max-w-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <span className="text-xs">No Photo Available</span>
            </div>
          )}
        </div>

        {/* Right: Item Info & Action (5 cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Date */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-gray-100 font-semibold px-2.5 py-1 rounded-md text-gray-700">
                {listing.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Listed {formattedDate}</span>
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl font-bold text-gray-950 tracking-tight leading-snug">
                {listing.title}
              </h1>
              <div className="text-3xl font-extrabold text-[#1877F2] mt-2 tracking-tight">
                {formattedPrice}
              </div>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Listed in <strong>{listing.location || 'Palo Alto, CA'}</strong></span>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-gray-100">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Description
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description || 'No description provided by the seller.'}
              </p>
            </div>

            {/* Seller Profile Box */}
            <div className="pt-2 border-t border-gray-100">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Seller Information
              </h2>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm">
                  {listing.seller_email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {listing.seller_email}
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    <span>Verified Facebook Seller</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-gray-100 space-y-2 mt-6">
            {/* Primary: Message Seller */}
            <button
              type="button"
              onClick={() => setIsMessageModalOpen(true)}
              className="w-full py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Seller</span>
            </button>

            {/* Secondary: Share Link */}
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Listing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message Seller Modal */}
      <MessageSellerModal
        listing={listing}
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
      />
    </main>
  );
}

export default function ListingDetailPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#1877F2] animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading item...</p>
          </div>
        }
      >
        <ListingDetailContent />
      </Suspense>
    </div>
  );
}

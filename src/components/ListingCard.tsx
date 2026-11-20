'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '../types/marketplace';
import { MapPin, Image as ImageIcon } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <Link
      href={`/item/${listing.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col h-full text-decoration-none"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        {listing.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-xs">No Photo</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-gray-700 px-2 py-0.5 rounded-full shadow-2xs">
          {listing.category}
        </span>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="text-lg font-bold text-gray-950 tracking-tight">
            {formattedPrice}
          </div>

          {/* Title */}
          <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mt-1 leading-snug group-hover:text-[#1877F2] transition-colors">
            {listing.title}
          </h3>
        </div>

        {/* Location & Time */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{listing.location || 'Palo Alto, CA'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

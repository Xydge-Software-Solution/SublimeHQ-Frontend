"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/lib/storage";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-amber-400 text-amber-400"
          />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-gray-200" />
            <div className="absolute overflow-hidden w-2 h-4">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
        ))}
      </div>
      <span className="text-sm text-gray-500">({reviewCount})</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all group cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </div>
  );
}

export { StarRating };

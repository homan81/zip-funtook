'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

export default function CartIcon({ className = '', showCount = true }: CartIconProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
    >
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {showCount && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-[#FC6E88] text-white text-xs font-bold rounded-full">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}


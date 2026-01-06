'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart, CartItem as CartItemType } from '@/app/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const itemTotal = item.sellingPrice * item.quantity;

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={item.productImage || '/placeholder.png'}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {item.productName}
        </h3>

        {/* Variants */}
        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
          <div className="mb-2">
            {Object.entries(item.selectedVariants).map(([key, value]) => (
              <span
                key={key}
                className="inline-block mr-2 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {item.price > item.sellingPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{item.price}
            </span>
          )}
          <span className="text-lg font-semibold text-[#FC6E88]">
            ₹{item.sellingPrice}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={item.stockQuantity ? item.quantity >= item.stockQuantity : false}
              className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-gray-900">
          ₹{itemTotal.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
          {item.quantity} × ₹{item.sellingPrice}
        </p>
      </div>
    </div>
  );
}


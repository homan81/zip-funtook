'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/app/components/cart/AddToCartButton';
import CartIcon from '@/app/components/cart/CartIcon';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(category && { category }),
      });

      const res = await fetch(`/api/products?${params}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setProducts(json.products || []);
        setTotalPages(json.pagination?.totalPages || 1);
      } else {
        throw new Error(json.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#FC6E88]">
              Funtook
            </Link>
            <CartIcon />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88]"
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88]"
            >
              <option value="">All Categories</option>
              {/* Add your categories here */}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const discount =
                  product.price > product.sellingPrice
                    ? Math.round(
                        ((product.price - product.sellingPrice) / product.price) * 100
                      )
                    : 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative w-full aspect-square bg-gray-100">
                        {product.productImage ? (
                          <Image
                            src={product.productImage}
                            alt={product.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="absolute top-2 right-2 bg-[#FC6E88] text-white px-2 py-1 rounded text-xs font-semibold">
                            {discount}% OFF
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 space-y-3">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-[#FC6E88] transition-colors">
                          {product.productName}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2">
                        {product.price > product.sellingPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#FC6E88]">
                          ₹{product.sellingPrice}
                        </span>
                      </div>

                      <AddToCartButton
                        product={{
                          id: product.id,
                          productName: product.productName,
                          productImage: product.productImage,
                          price: product.price,
                          sellingPrice: product.sellingPrice,
                          stockQuantity: product.stockQuantity,
                          variants: product.variants,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


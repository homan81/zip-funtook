'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import AddToCartButton from '@/app/components/cart/AddToCartButton';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const json = await res.json();

        if (!res.ok || !json.success || !json.product) {
          throw new Error(json.message || 'Failed to load product');
        }

        setProduct(json.product);
        // Set initial selected image
        if (json.product.productImage) {
          setSelectedImage(json.product.productImage);
        } else if (json.product.gallery && json.product.gallery.length > 0) {
          setSelectedImage(json.product.gallery[0].image || json.product.gallery[0]);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#FC6E88] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.price > product.sellingPrice
    ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
    : 0;

  const galleryImages = product.gallery && Array.isArray(product.gallery)
    ? product.gallery.map((img: any) => img.image || img)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FC6E88] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.productName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-[#FC6E88] ring-2 ring-[#FC6E88]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.productName} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h1>
              {product.product_tags && product.product_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.product_tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium bg-[#FC6E88]/10 text-[#FC6E88] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.price > product.sellingPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
              <span className="text-4xl font-bold text-[#FC6E88]">
                ₹{product.sellingPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Availability:</span>
                <span className={`text-sm font-semibold ${
                  (product.stockQuantity ?? 0) > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(product.stockQuantity ?? 0) > 0
                    ? `${product.stockQuantity} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
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
                showQuantityControls={true}
              />
            </div>

            {/* Additional Info Sections */}
            {product.packageInclusion && product.packageInclusion.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Includes</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.packageInclusion.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.deliveryDetails && product.deliveryDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Details</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.deliveryDetails.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {product.faqs && product.faqs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {product.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


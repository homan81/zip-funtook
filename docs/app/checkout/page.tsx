"use client";

import React, { useState, useEffect, Suspense } from 'react';
import RequireAuth from '@/app/components/admin/RequireAuth';
import { useCart } from '@/app/contexts/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const subtotal = getTotalPrice();

  const [calcSubtotal, setCalcSubtotal] = useState<number>(subtotal);
  const [calcShipping, setCalcShipping] = useState<number>(0);
  const [calcTaxes, setCalcTaxes] = useState<number>(0);
  const [calcTotal, setCalcTotal] = useState<number>(subtotal);
  const [coupon, setCoupon] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => { 
    console.log('handlePlaceOrder called');

    if (!name || !address || !phone) {
      toast.error('Please fill shipping details');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('place order payload preparing');
      const payload = {
        // Do NOT send prices from client — server will calculate
        items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, selectedVariants: i.selectedVariants })),
        shipping: calcShipping || 0,
        taxes: calcTaxes || 0,
        coupon: coupon || null,
        shippingAddress: { name, address },
        shippingPhone: phone,
        currency: 'INR'
      };

      console.log('place order payload', payload);

      const createRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      console.log('createRes status', createRes.status);

      let createJson = null;
      try {
        createJson = await createRes.json();
      } catch (e) {
        const text = await createRes.text().catch(() => '');
        throw new Error(`Order create failed: ${createRes.status} ${text}`);
      }

      if (!createRes.ok || !createJson || !createJson.success) {
        throw new Error(createJson?.message || 'Failed to create order');
      }

      const { orderId, paymentId } = createJson;
      console.log('order created', { orderId, paymentId });

      // For now mark payment as paid (manual flow)
      const verifyRes = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentId, status: 'paid', provider_payment_id: `manual-${paymentId}` }),
        credentials: 'include',
      });

      console.log('verifyRes status', verifyRes.status);

      let verifyJson = null;
      try {
        verifyJson = await verifyRes.json();
      } catch (e) {
        const text = await verifyRes.text().catch(() => '');
        throw new Error(`Payment verify failed: ${verifyRes.status} ${text}`);
      }

      if (!verifyRes.ok || !verifyJson || !verifyJson.success) {
        throw new Error(verifyJson?.message || 'Payment verification failed');
      }

      toast.success('Order placed successfully');
      try { alert('Order placed test: ' + orderId); } catch(e) {}
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err: any) {
      console.error('Place order error', err);
      toast.error(err?.message || 'Failed to place order');
      try { alert('Order failed: ' + (err?.message || String(err))); } catch(e) {}
    } finally {
      setIsSubmitting(false);
    }
  };

  // call calculate endpoint to compute server-side totals
  const runCalculate = async () => {
    try {
      const payload = { items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, selectedVariants: i.selectedVariants })), coupon };
      const res = await fetch('/api/orders/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) return;
      const j = await res.json().catch(() => null);
      if (j && j.success) {
        setCalcSubtotal(Number(j.subtotal ?? 0));
        setCalcShipping(Number(j.shipping ?? 0));
        setCalcTaxes(Number(j.taxes ?? 0));
        setCalcTotal(Number(j.total ?? j.totalPrice ?? (j.subtotal ?? 0)));
      }
    } catch (err) {
      console.error('calculate error', err);
    }
  };

  useEffect(() => {
    // run on first render and whenever cart or coupon changes
    runCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length, coupon]);

  return (
    <Suspense fallback={null}>
      <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border rounded px-3 py-2" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full border rounded px-3 py-2" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mt-6">
              <div className="mb-3">
                <input value={coupon ?? ''} onChange={(e) => setCoupon(e.target.value || null)} placeholder="Coupon code (optional)" className="w-full border rounded px-3 py-2" />
              </div>
              <button onClick={handlePlaceOrder} disabled={isSubmitting} className={`w-full py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-[#FC6E88]'}`}>
                {isSubmitting ? 'Placing order...' : `Place Order - ₹${(calcTotal ?? subtotal).toFixed(2)}`}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">₹{(item.sellingPrice * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">Subtotal <span>₹{(calcSubtotal ?? subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between text-sm">Shipping <span>₹{calcShipping.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm">Taxes <span>₹{calcTaxes.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold">Total <span>₹{(calcTotal ?? subtotal).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
      </RequireAuth>
    </Suspense>
  );
}

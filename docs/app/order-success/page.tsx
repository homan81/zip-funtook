import React from 'react';
import { connectDB } from '@/config/db';
import type { RowDataPacket } from 'mysql2';
import Link from 'next/link';

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams?.orderId;
  if (!orderId) {
    return (<div className="p-8">Order ID missing in query string.</div>);
  }

  
    const db = await connectDB();
    const [orders] = await db.execute<RowDataPacket[]>(`SELECT * FROM orders WHERE id = ? LIMIT 1`, [orderId]);
    if (!Array.isArray(orders) || orders.length === 0) {
      return (<div className="p-8">Order not found: {orderId}</div>);
    }
    const order = orders[0] as any;

    const [items] = await db.execute<RowDataPacket[]>(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);
    const [payments] = await db.execute<RowDataPacket[]>(`SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC`, [orderId]);

    return (
        <>
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Order #{order.id}</h1>
          <div className="mb-4">Status: <strong>{order.status}</strong></div>
          <div className="mb-4">Total: <strong>₹{Number(order.total_amount).toFixed(2)}</strong></div>

          <h2 className="text-lg font-medium mt-6">Items</h2>
          <ul className="mt-2 space-y-2">
            {Array.isArray(items) && items.map((it: any) => (
              <li key={it.id} className="flex justify-between border p-3 rounded">
                <div>
                  <div className="font-medium">{it.product_name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
                </div>
                <div className="font-medium">₹{Number(it.total_price).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-medium mt-6">Payments</h2>
          <ul className="mt-2 space-y-2">
            {Array.isArray(payments) && payments.map((p: any) => (
              <li key={p.id} className="border p-3 rounded">
                <div>Payment #{p.id} — {p.provider || 'manual'}</div>
                <div>Status: <strong>{p.status}</strong></div>
                <div>Amount: ₹{Number(p.amount).toFixed(2)}</div>
                <div className="text-sm text-gray-500">Provider id: {p.provider_payment_id || '—'}</div>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link href="/" className="text-[#FC6E88] hover:underline">Back to shop</Link>
          </div>
        </div>
      </div>
      </>
    );

}

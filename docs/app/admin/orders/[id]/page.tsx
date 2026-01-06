

import React from 'react';
import { connectDB } from '@/config/db';
import type { RowDataPacket } from 'mysql2';
import Link from 'next/link';
//import dynamic from 'next/dynamic';
import OrderActionsClient from './OrderActionsClient';

//const OrderActionsClient = dynamic(() => import('./OrderActionsClient'), { ssr: false });

type Props = { params: { id: string } };

export default async function OrderDetailPage({ params }: Props) {
    
const {id} =  await params;

  const db = await connectDB();

  const [orders] = await db.execute<RowDataPacket[]>(`SELECT * FROM orders WHERE id = ? LIMIT 1`, [id]);
  if (!Array.isArray(orders) || orders.length === 0) {
    return <div className="p-8">Order not found: {id}</div>;
  }
  const order: any = orders[0];

  const [items] = await db.execute<RowDataPacket[]>(`SELECT * FROM order_items WHERE order_id = ?`, [id]);
  const [payments] = await db.execute<RowDataPacket[]>(`SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC`, [id]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
        <Link href="/admin/orders" className="text-sm text-gray-600 hover:underline">Back to orders</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-medium mb-4">Items</h2>
          <ul className="space-y-2">
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
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-medium mb-4">Order Info</h2>
          <div className="space-y-2 text-sm">
            <div>Status: <strong>{order.status}</strong></div>
            <div>Total: ₹{Number(order.total_amount).toFixed(2)}</div>
            <div>Currency: {order.currency}</div>
            <div>Created: {new Date(order.created_at).toLocaleString()}</div>
            <div className="mt-4">
              <h3 className="font-medium">Payments</h3>
              <ul className="mt-2 space-y-2">
                {Array.isArray(payments) && payments.map((p: any) => (
                  <li key={p.id} className="border p-2 rounded text-sm">
                    <div>#{p.id} — {p.provider || 'manual'}</div>
                    <div>Status: <strong>{p.status}</strong></div>
                    <div>Amount: ₹{Number(p.amount).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-xs text-gray-600">Actions</div>
            <div className="mt-2"><OrderActionsClient orderId={id} initialStatus={order.status} /></div>
            <div className="mt-4 text-xs text-gray-600">Or use the admin API (requires `x-admin-secret` or admin session):</div>
            {/* <pre className="mt-2 p-2 bg-gray-50 rounded text-xs">curl -X POST "http://localhost:3000/api/admin/orders/{id}" -H "Content-Type: application/json" -H "x-admin-secret: $ADMIN_SECRET" -d '{"status":"paid"}'</pre> */}
          </div>
        </div>
      </div>
    </div>
  );
}

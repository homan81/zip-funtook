"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function OrderActionsClient({ orderId, initialStatus }: { orderId: string | number, initialStatus?: string }) {
  const [status, setStatus] = useState(initialStatus || 'pending');
  const [loading, setLoading] = useState(false);

  async function doAction(newStatus: string) {
    if (loading) return;
    if (!confirm(`Set order #${orderId} status to ${newStatus}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      const j = await res.json();
      if (!res.ok || !j.success) throw new Error(j?.message || 'Failed');
      setStatus(newStatus);
      toast.success('Order updated');
    } catch (err: any) {
      console.error('Admin action error', err);
      toast.error(err?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <button disabled={loading || status === 'paid'} onClick={() => doAction('paid')} className={`px-3 py-1 rounded text-white ${status === 'paid' ? 'bg-gray-400' : 'bg-green-600'}`}>
          {loading ? 'Updating...' : 'Mark Paid'}
        </button>
        <button disabled={loading || status === 'cancelled'} onClick={() => doAction('cancelled')} className={`px-3 py-1 rounded text-white ${status === 'cancelled' ? 'bg-gray-400' : 'bg-red-600'}`}>
          {loading ? 'Updating...' : 'Cancel Order'}
        </button>
      </div>
      <div className="text-sm text-gray-600 mt-2">Current status: <strong>{status}</strong></div>
    </div>
  );
}

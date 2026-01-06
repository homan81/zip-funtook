import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getToken } from 'next-auth/jwt';
import type { ResultSetHeader } from 'mysql2';
import type { RowDataPacket } from 'mysql2';

async function getUserIdFromToken(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return null;
    const email = (token as any).email;
    if (!email) return null;
    const db = await connectDB();
    const [rows] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    const userRow = Array.isArray(rows) && (rows as any[])[0];
    return userRow ? userRow.id : null;
  } catch (err) {
    console.error('Error getting user id from token', err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, paymentId, status = 'paid', provider_payment_id, metadata } = body;
    if (!orderId && !paymentId) return NextResponse.json({ success: false, message: 'orderId or paymentId required' }, { status: 400 });

    const db = await connectDB();

    // Optionally check that the order belongs to the authenticated user
    const userId = await getUserIdFromToken(req);
    if (userId) {
      const [rows] = await db.execute(`SELECT id FROM orders WHERE id = ? AND user_id = ? LIMIT 1`, [orderId, userId]);
      if (!Array.isArray(rows) || (rows as any[]).length === 0) {
        return NextResponse.json({ success: false, message: 'Order not found for user' }, { status: 404 });
      }
    }

    // Update order status
    // update payments table if paymentId provided else find payment by order
    let pid = paymentId;
    if (!pid) {
      const [pr] = await db.execute<RowDataPacket[]>(`SELECT id FROM payments WHERE order_id = ? LIMIT 1`, [orderId]);
      const prow = Array.isArray(pr) && (pr as any[])[0];
      pid = prow ? prow.id : null;
    }

    if (pid) {
      await db.execute<ResultSetHeader>(`UPDATE payments SET status = ?, provider_payment_id = ?, metadata = ? WHERE id = ?`, [status, provider_payment_id ?? null, metadata ? JSON.stringify(metadata) : null, pid]);
    }

    // Update orders.status to paid if payment marked paid
    if (status === 'paid') {
      await db.execute<ResultSetHeader>(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, orderId]);
      // If order has coupon metadata, increment coupon used_count now (payment confirmed)
      try {
        const [ordRows] = await db.execute<RowDataPacket[]>(`SELECT metadata FROM orders WHERE id = ? LIMIT 1`, [orderId]);
        const orow = Array.isArray(ordRows) && (ordRows as any[])[0];
        if (orow && orow.metadata) {
          let meta: any = null;
          try { meta = typeof orow.metadata === 'string' ? JSON.parse(orow.metadata) : orow.metadata; } catch(e) { meta = orow.metadata }
          if (meta && meta.coupon && (meta.coupon.id || meta.coupon.code)) {
            const couponId = meta.coupon.id ? Number(meta.coupon.id) : null;
            if (couponId) {
              await db.execute(`UPDATE coupons SET used_count = used_count + 1 WHERE id = ?`, [couponId]);
            } else if (meta.coupon.code) {
              await db.execute(`UPDATE coupons SET used_count = used_count + 1 WHERE code = ?`, [String(meta.coupon.code)]);
            }
          }
        }
      } catch (e) {
        console.error('Failed to increment coupon used_count on verify', e);
      }
    }

    return NextResponse.json({ success: true, orderId, paymentId: pid, status });
  } catch (err: any) {
    console.error('Verify order error', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

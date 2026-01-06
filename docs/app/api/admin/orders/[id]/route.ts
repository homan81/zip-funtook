import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getToken } from 'next-auth/jwt';
import type { ResultSetHeader } from 'mysql2';
import type { RowDataPacket } from 'mysql2';

// Admin update route. Accepts either header `x-admin-secret` matching process.env.ADMIN_SECRET
// or a NextAuth session token where the user email matches process.env.ADMIN_EMAIL or has role 'admin'.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');

    // allow via admin secret
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      // if no valid secret, try NextAuth token
      try {
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
        const isAdminByEmail = token && (token as any).email && process.env.ADMIN_EMAIL && (token as any).email === process.env.ADMIN_EMAIL;
        const isAdminByRole = token && (token as any).role && (token as any).role === 'admin';
        if (!isAdminByEmail && !isAdminByRole) {
          return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
      } catch (e) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();
    const { status, provider_payment_id, metadata } =  body;
    
const {id} =  await params;

    if (!id) return NextResponse.json({ success: false, message: 'Order id required' }, { status: 400 });

    const db = await connectDB();

    if (provider_payment_id || status) {
      // update payments if exists
      const [pr] = await db.execute<RowDataPacket[]>(`SELECT id FROM payments WHERE order_id = ? LIMIT 1`, [id]);
      const prow = Array.isArray(pr) && (pr as any[])[0];
      const pid = prow ? prow.id : null;
      if (pid) {
        await db.execute<ResultSetHeader>(`UPDATE payments SET provider_payment_id = ?, metadata = ?, status = ? WHERE id = ?`, [provider_payment_id ?? null, metadata ? JSON.stringify(metadata) : null, status ?? 'pending', pid]);
      }
      if (status) {
        await db.execute<ResultSetHeader>(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, id]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin update order error', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

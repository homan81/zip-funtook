import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getToken } from 'next-auth/jwt';
import type { RowDataPacket } from 'mysql2';

// Admin stats endpoint - returns order counts and recent orders
export async function GET(req: Request) {
  try {
    // Check admin auth (same as update endpoint)
    const adminSecret = req.headers.get('x-admin-secret');
    
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
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

    const db = await connectDB();

    // Get counts by status
    const [countRows] = await db.execute<RowDataPacket[]>(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);

    const stats: any = { total: 0, pending: 0, paid: 0, cancelled: 0, failed: 0 };
    if (Array.isArray(countRows)) {
      countRows.forEach((r: any) => {
        const status = r.status || 'pending';
        const count = Number(r.count || 0);
        stats[status] = count;
        stats.total += count;
      });
    }

    // Get recent 5 orders
    const [recentRows] = await db.execute<RowDataPacket[]>(`
      SELECT id, status, total_amount, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    return NextResponse.json({ 
      success: true, 
      stats, 
      recentOrders: Array.isArray(recentRows) ? recentRows : [] 
    });
  } catch (err: any) {
    console.error('Order stats error', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: Request) {
  try {
    const db = await connectDB();
    const [rows] = await db.execute<RowDataPacket[]>(`SELECT * FROM coupons ORDER BY created_at DESC`);
    return NextResponse.json({ success: true, coupons: rows });
  } catch (err: any) {
    console.error('GET COUPONS ERROR', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body.code || '').trim();
    if (!code) return NextResponse.json({ success: false, message: 'Code is required' }, { status: 400 });

    const type = body.type === 'fixed' ? 'fixed' : 'percent';
    const value = Number(body.value ?? 0);
    const max_uses = body.max_uses ? Number(body.max_uses) : null;
    const min_cart_value = body.min_cart_value ? Number(body.min_cart_value) : null;
    const expires_at = body.expires_at ? String(body.expires_at) : null;
    const active = body.active === false ? 0 : 1;

    const db = await connectDB();
    const [res] = await db.execute<ResultSetHeader>(`INSERT INTO coupons (code, type, value, max_uses, min_cart_value, expires_at, active, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [code, type, value, max_uses, min_cart_value, expires_at, active, JSON.stringify(body.metadata || {})]);

    return NextResponse.json({ success: true, couponId: (res as any).insertId });
  } catch (err: any) {
    console.error('CREATE COUPON ERROR', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

//export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id}=  await params;
    const db = await connectDB();
    const [rows] = await db.execute<RowDataPacket[]>(`SELECT * FROM coupons WHERE id = ? LIMIT 1`, [id]);
    if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, coupon: rows[0] });
  } catch (err: any) {
    console.error('GET COUPON ERROR', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const body = await req.json();
    const db = await connectDB();
    const fields: string[] = [];
    const values: any[] = [];

    if (body.code) { fields.push('code = ?'); values.push(body.code); }
    if (body.type) { fields.push('type = ?'); values.push(body.type); }
    if (body.value !== undefined) { fields.push('value = ?'); values.push(Number(body.value)); }
    if (body.max_uses !== undefined) { fields.push('max_uses = ?'); values.push(body.max_uses ? Number(body.max_uses) : null); }
    if (body.min_cart_value !== undefined) { fields.push('min_cart_value = ?'); values.push(body.min_cart_value ? Number(body.min_cart_value) : null); }
    if (body.expires_at !== undefined) { fields.push('expires_at = ?'); values.push(body.expires_at ? String(body.expires_at) : null); }
    if (body.active !== undefined) { fields.push('active = ?'); values.push(body.active ? 1 : 0); }
    if (body.metadata !== undefined) { fields.push('metadata = ?'); values.push(JSON.stringify(body.metadata || {})); }

    if (fields.length === 0) return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });

    values.push(id);
    const sql = `UPDATE coupons SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute<ResultSetHeader>(sql, values);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('UPDATE COUPON ERROR', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
const {id} =  await params;
    console.log('Deleting coupon with id:', id);
    const db = await connectDB();
    await db.execute<ResultSetHeader>(`DELETE FROM coupons WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE COUPON ERROR', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

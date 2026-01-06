import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import type { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return NextResponse.json({ success: false, message: 'No items provided' }, { status: 400 });

    const db = await connectDB();

    let subtotal = 0;
    const detailed: any[] = [];

    for (const it of items) {
      const productId = it.product_id ?? it.productId;
      const qty = Number(it.quantity ?? 1);
      if (!productId) continue;

      const [rows] = await db.execute<RowDataPacket[]>(`SELECT id, productName, price, sellingPrice FROM products WHERE id = ? LIMIT 1`, [productId]);
      if (!Array.isArray(rows) || rows.length === 0) continue;
      const p = rows[0] as any;
      const unit = Number(p.sellingPrice ?? p.price ?? 0);
      const total = +(unit * qty).toFixed(2);
      subtotal += total;

      detailed.push({ productId, productName: p.productName, unitPrice: unit, quantity: qty, total });
    }

    // apply coupon if provided
    let discountAmount = 0;
    let appliedCoupon: any = null;
    if (body.coupon) {
      const code = String(body.coupon).trim();
      if (code) {
        const [rows] = await db.execute<RowDataPacket[]>(`SELECT * FROM coupons WHERE code = ? LIMIT 1`, [code]);
        const c = Array.isArray(rows) && rows[0] ? (rows[0] as any) : null;
        if (c) {
          const now = new Date();
          const expired = c.expires_at ? new Date(c.expires_at) < now : false;
          const usesExceeded = c.max_uses !== null && c.max_uses !== undefined && c.max_uses > 0 && c.used_count >= c.max_uses;
          const minOk = c.min_cart_value ? Number(subtotal) >= Number(c.min_cart_value) : true;

          if (c.active && !expired && !usesExceeded && minOk) {
            if (c.type === 'percent') {
              discountAmount = +(subtotal * (Number(c.value) / 100)).toFixed(2);
            } else {
              discountAmount = Math.min(Number(c.value), subtotal);
            }
            appliedCoupon = { id: c.id, code: c.code, type: c.type, value: Number(c.value) };
          }
        }
      }
    }

    const shipping = Number(body.shipping ?? 0);
    const taxes = Number(body.taxes ?? 0);
    const totalBefore = +(subtotal + shipping + taxes).toFixed(2);
    const totalAfterDiscount = +(Math.max(0, subtotal - discountAmount) + shipping + taxes).toFixed(2);

    return NextResponse.json({ success: true, subtotal: +subtotal.toFixed(2), discount: discountAmount, coupon: appliedCoupon, shipping, taxes, total: totalAfterDiscount, items: detailed });
  } catch (err: any) {
    console.error('Calculate order error', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getToken } from 'next-auth/jwt';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

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
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return NextResponse.json({ success: false, message: 'No items provided' }, { status: 400 });

    const shippingAddress = body.shippingAddress ?? null;
    const shippingPhone = body.shippingPhone ?? null;
    const currency = body.currency ?? 'INR';
    const sessionId = body.sessionId ?? body.session_id ?? null;

    const db = await connectDB();

    // calculate totals similar to calculate route
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

      detailed.push({ productId, productName: p.productName, unitPrice: unit, quantity: qty, total, selectedVariants: it.selected_variants ?? it.selectedVariants ?? null });
    }

    // apply coupon if provided (same logic as calculate)
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
    const grandTotal = +(Math.max(0, subtotal - discountAmount) + shipping + taxes).toFixed(2);

    // determine user id if authenticated
    const userId = await getUserIdFromToken(req);

    // create order
    const metadataObj: any = { itemsCount: detailed.length };
    if (appliedCoupon) metadataObj.coupon = { id: appliedCoupon.id, code: appliedCoupon.code, discount: discountAmount };

    const [insertRes] = await db.execute<ResultSetHeader>(`INSERT INTO orders (user_id, session_id, status, total_amount, currency, shipping_address, shipping_phone, metadata) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)`, [userId, sessionId, grandTotal, currency, shippingAddress ? JSON.stringify(shippingAddress) : null, shippingPhone, JSON.stringify(metadataObj)]);
    const orderId = (insertRes as any).insertId;

    // insert order items
    const insertItemSql = `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, selected_variants) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    for (const it of detailed) {
      await db.execute<ResultSetHeader>(insertItemSql, [orderId, it.productId, it.productName, it.quantity, it.unitPrice, it.total, it.selectedVariants ? JSON.stringify(it.selectedVariants) : null]);
    }

    // create a payments row (dummy/manual for now) and link to order
    const [payRes] = await db.execute<ResultSetHeader>(`INSERT INTO payments (order_id, provider, provider_payment_id, status, amount, currency, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`, [orderId, 'manual', null, 'pending', grandTotal, currency, JSON.stringify({ createdBy: 'create-order-api' })]);
    const paymentId = (payRes as any).insertId;

    // NOTE: coupon used_count will be incremented on payment verification (to avoid counting failed payments)

    return NextResponse.json({ success: true, orderId, paymentId, total: grandTotal });
  } catch (err: any) {
    console.error('Create order error', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

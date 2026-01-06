import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sort = searchParams.get('sort') || 'newest';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    let sortQuery = 'ORDER BY id DESC';
    if (sort === 'oldest') sortQuery = 'ORDER BY id ASC';
    if (sort === 'price_asc') sortQuery = 'ORDER BY total_amount ASC';
    if (sort === 'price_desc') sortQuery = 'ORDER BY total_amount DESC';

    const db = await connectDB();

    // Build WHERE and params safely
    const whereClauses: string[] = [];
    const params: any[] = [];
    if (search) {
      whereClauses.push(`(id = ? OR shipping_phone LIKE ? OR JSON_EXTRACT(shipping_address, '$.name') LIKE ?)`);
      params.push(search, `%${search}%`, `%${search}%`);
    }
    if (status) {
      whereClauses.push('status = ?');
      params.push(status);
    }
    if (startDate) {
      whereClauses.push('DATE(created_at) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push('DATE(created_at) <= ?');
      params.push(endDate);
    }
    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [countRows] = await db.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM orders ${where}`, params);
    const totalItems = (Array.isArray(countRows) && (countRows as any)[0] && Number((countRows as any)[0].total)) || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    const [orders] = await db.execute<RowDataPacket[]>(`SELECT * FROM orders ${where} ${sortQuery} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const ordersArr: any[] = Array.isArray(orders) ? orders : [];

    let items: any[] = [];
    let payments: any[] = [];
    if (ordersArr.length > 0) {
      const ids = ordersArr.map((o) => Number(o.id)).join(',');
      const [itRows] = await db.execute<RowDataPacket[]>(`SELECT * FROM order_items WHERE order_id IN (${ids})`);
      const [payRows] = await db.execute<RowDataPacket[]>(`SELECT * FROM payments WHERE order_id IN (${ids})`);
      items = Array.isArray(itRows) ? itRows : [];
      payments = Array.isArray(payRows) ? payRows : [];
    }

    const finalOrders = ordersArr.map((order: any) => {
      const orderItems = items.filter((it: any) => it.order_id === order.id);
      const payment = payments.find((p: any) => p.order_id === order.id) || null;
      return {
        id: order.id,
        user_id: order.user_id,
        session_id: order.session_id,
        status: order.status,
        total_amount: order.total_amount,
        currency: order.currency,
        shipping_address: order.shipping_address,
        shipping_phone: order.shipping_phone,
        created_at: order.created_at,
        items: orderItems,
        payment,
      };
    });

    return NextResponse.json({ success: true, page, limit, totalItems, totalPages, orders: finalOrders });
  } catch (err: any) {
    console.error('Orders list error', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

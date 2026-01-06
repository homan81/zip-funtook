import { NextResponse } from 'next/server'
import { connectDB } from '@/config/db'
import type { RowDataPacket } from 'mysql2'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const parts = url.pathname.split('/')
    const id = parts[parts.length - 3] || parts[parts.length - 2]
    const userId = Number(id)
    if (!userId) return NextResponse.json({ success: false, message: 'Invalid user id' }, { status: 400 })

    const db = await connectDB()
    const [ordersRows] = await db.execute<RowDataPacket[]>('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId])
    const ordersArr = Array.isArray(ordersRows) ? ordersRows : []

    let items: any[] = []
    let payments: any[] = []
    if (ordersArr.length > 0) {
      const ids = ordersArr.map((o) => Number(o.id)).join(',')
      const [itRows] = await db.execute<RowDataPacket[]>(`SELECT * FROM order_items WHERE order_id IN (${ids})`)
      const [payRows] = await db.execute<RowDataPacket[]>(`SELECT * FROM payments WHERE order_id IN (${ids})`)
      items = Array.isArray(itRows) ? itRows : []
      payments = Array.isArray(payRows) ? payRows : []
    }

    const final = ordersArr.map((order: any) => ({
      id: order.id,
      user_id: order.user_id,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      items: items.filter((it: any) => it.order_id === order.id),
      payment: payments.find((p: any) => p.order_id === order.id) || null,
    }))

    return NextResponse.json({ success: true, orders: final })
  } catch (err: any) {
    console.error('Admin user orders error', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

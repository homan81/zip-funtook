// pages/api/orders/index.ts

import {NextApiResponse } from "next";
//port { connectDB } from "../../../lib/db";  // Your DB helper function
import {connectDB} from '@/config/db';
import type { RowDataPacket } from 'mysql2';

export default async function handler(req: Request, res: NextApiResponse) {
  try {
    const conn = await connectDB();

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Search
    const search = searchParams.get("search") || "";

    // Filters
    const status = searchParams.get("status") || "";

    // Sorting
    const sort = searchParams.get("sort") || "newest";

    let sortQuery = "ORDER BY id DESC"; // default
    if (sort === "oldest") sortQuery = "ORDER BY id ASC";
    if (sort === "price_asc") sortQuery = "ORDER BY total_amount ASC";
    if (sort === "price_desc") sortQuery = "ORDER BY total_amount DESC";

    // Build WHERE conditions
    let where = "WHERE 1=1";

    if (search) {
      where += ` AND (order_id LIKE '%${search}%' OR shipping_address LIKE '%${search}%' OR shipping_phone LIKE '%${search}%')`;
    }

    if (status) {
      where += ` AND status = '${status}'`;
    }

    // Count total filtered orders
    const [countResult] = await conn.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS total FROM orders ${where}
    `);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch paginated filtered orders
    const [orders] = await conn.execute<RowDataPacket[]>(`
      SELECT * FROM orders
      ${where}
      ${sortQuery}
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Fetch additional data (order items and payments)
    const [orderItems] = await conn.execute<RowDataPacket[]>(`
      SELECT * FROM order_items WHERE order_id IN (${orders.map((o: any) => o.id).join(",")})
    `);
    const [payments] = await conn.execute<RowDataPacket[]>(`
      SELECT * FROM payments WHERE order_id IN (${orders.map((o: any) => o.id).join(",")})
    `);

    // Merge data with order items and payments
    const finalOrders = orders.map((order: any) => {
      const items = orderItems.filter((item: any) => item.order_id === order.id);
      const payment = payments.find((pay: any) => pay.order_id === order.id);
      return {
        ...order,
        items,
        payment
      };
    });

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalItems,
      totalPages,
      orders: finalOrders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
}

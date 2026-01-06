
import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getToken } from 'next-auth/jwt';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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

// GET - Get user's cart (optional: for server-side cart persistence)
export async function GET(req: Request) {
  try {
    // Allow fetching server-side cart by authenticated user or by guest session id
    const search = new URL(req.url).searchParams;
    const sessionIdParam = search.get('sessionId') || search.get('session_id');
    const userId = await getUserIdFromToken(req);

    const db = await connectDB();
    let rows: RowDataPacket[] = [];
    if (userId) {
      const [r] = await db.execute<RowDataPacket[]>(
        `SELECT c.product_id, c.quantity, c.selected_variants, p.productName, p.productImage, p.price, p.sellingPrice FROM cart c LEFT JOIN products p ON p.id = c.product_id WHERE c.user_id = ?`,
        [userId]
      );
      rows = Array.isArray(r) ? r : [];
    } else if (sessionIdParam) {
      const [r] = await db.execute<RowDataPacket[]>(
        `SELECT c.product_id, c.quantity, c.selected_variants, p.productName, p.productImage, p.price, p.sellingPrice FROM cart c LEFT JOIN products p ON p.id = c.product_id WHERE c.session_id = ?`,
        [sessionIdParam]
      );
      rows = Array.isArray(r) ? r : [];
    } else {
      return NextResponse.json({ success: true, message: 'Cart is managed client-side via localStorage', items: [] });
    }

    const items = rows.map((r: any) => ({
      productId: Number(r.product_id),
      quantity: Number(r.quantity),
      selectedVariants: r.selected_variants ? JSON.parse(r.selected_variants) : null,
      productName: r.productName,
      productImage: r.productImage,
      price: Number(r.price || 0),
      sellingPrice: Number(r.sellingPrice || r.price || 0),
    }));

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('GET CART ERROR:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If client sends an array of items (sync from client), handle bulk
    const db = await connectDB();

    // If client sends an array of items (sync from client), handle bulk and persist when authenticated
    if (Array.isArray(body.items)) {
      const validated: any[] = [];
      for (const it of body.items) {
        const productId = it.product_id ?? it.productId;
        const quantity = Number(it.quantity ?? 1);
        const selectedVariants = it.selected_variants ?? it.selectedVariants ?? null;
        if (!productId) continue;

        const [rows] = await db.execute<RowDataPacket[]>(`SELECT * FROM products WHERE id = ? LIMIT 1`, [productId]);
        if (!Array.isArray(rows) || rows.length === 0) continue;
        const product = rows[0];

        if (product.stockQuantity !== null && product.stockQuantity !== undefined) {
          if (quantity <= 0) continue;
          if (product.stockQuantity === 0) continue;
          if (quantity > product.stockQuantity) {
            validated.push({ productId: product.id, quantity: product.stockQuantity, selectedVariants, note: 'quantity capped to available stock' });
            continue;
          }
        }

        validated.push({ productId: product.id, productName: product.productName, productImage: product.productImage || '/placeholder.png', price: parseFloat(product.price) || 0, sellingPrice: parseFloat(product.sellingPrice) || parseFloat(product.price) || 0, quantity, selectedVariants, stockQuantity: product.stockQuantity ?? null });
      }

      // If authenticated, replace server cart for user; else if sessionId provided, replace by session
      const userId = await getUserIdFromToken(req);
      const sessionIdBody = body.sessionId ?? body.session_id ?? null;
      if (userId) {
        await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
        const insertSql = 'INSERT INTO cart (user_id, product_id, quantity, selected_variants, session_id) VALUES (?, ?, ?, ?, NULL)';
        for (const it of validated) {
          await db.execute<ResultSetHeader>(insertSql, [userId, it.productId, it.quantity, it.selectedVariants ? JSON.stringify(it.selectedVariants) : null]);
        }
      } else if (sessionIdBody) {
        await db.execute('DELETE FROM cart WHERE session_id = ?', [sessionIdBody]);
        const insertSql = 'INSERT INTO cart (user_id, product_id, quantity, selected_variants, session_id) VALUES (NULL, ?, ?, ?, ?)';
        for (const it of validated) {
          await db.execute<ResultSetHeader>(insertSql, [it.productId, it.quantity, it.selectedVariants ? JSON.stringify(it.selectedVariants) : null, sessionIdBody]);
        }
      }

      return NextResponse.json({ success: true, items: validated });
    }

    // Single item add - accept both `productId` and `product_id`
    const productId = body.productId ?? body.product_id;
    const quantity = Number(body.quantity ?? 1);
    const selectedVariants = body.selectedVariants ?? body.selected_variants ?? null;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const [products] = await db.execute<RowDataPacket[]>(`SELECT * FROM products WHERE id = ? LIMIT 1`, [productId]);
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    const product = products[0];

    if (product.stockQuantity !== null && product.stockQuantity !== undefined) {
      if (quantity <= 0) return NextResponse.json({ success: false, message: 'Quantity must be greater than 0' }, { status: 400 });
      if (product.stockQuantity === 0) return NextResponse.json({ success: false, message: 'Product is out of stock' }, { status: 400 } );
      if (quantity > product.stockQuantity) return NextResponse.json({ success: false, message: `Only ${product.stockQuantity} items available in stock`, availableStock: product.stockQuantity }, { status: 400 });
    }

    const cartItem = { productId: product.id, productName: product.productName, productImage: product.productImage || '/placeholder.png', price: parseFloat(product.price) || 0, sellingPrice: parseFloat(product.sellingPrice) || parseFloat(product.price) || 0, quantity: Number(quantity), selectedVariants, stockQuantity: product.stockQuantity ?? null };

    // Persist single item for authenticated user or session: upsert (update quantity or insert)
    const userId = await getUserIdFromToken(req);
    const sessionIdBody = body.sessionId ?? body.session_id ?? null;
    if (userId) {
      const [updateRes] = await db.execute<ResultSetHeader>(`UPDATE cart SET quantity = ?, selected_variants = ? WHERE user_id = ? AND product_id = ?`, [cartItem.quantity, cartItem.selectedVariants ? JSON.stringify(cartItem.selectedVariants) : null, userId, cartItem.productId]);

      if ((updateRes as any).affectedRows === 0) {
        const insertSql = 'INSERT INTO cart (user_id, product_id, quantity, selected_variants, session_id) VALUES (?, ?, ?, ?, NULL)';
        await db.execute<ResultSetHeader>(insertSql, [userId, cartItem.productId, cartItem.quantity, cartItem.selectedVariants ? JSON.stringify(cartItem.selectedVariants) : null]);
      }
    } else if (sessionIdBody) {
      const [updateRes] = await db.execute<ResultSetHeader>(`UPDATE cart SET quantity = ?, selected_variants = ? WHERE session_id = ? AND product_id = ?`, [cartItem.quantity, cartItem.selectedVariants ? JSON.stringify(cartItem.selectedVariants) : null, sessionIdBody, cartItem.productId]);
      if ((updateRes as any).affectedRows === 0) {
        const insertSql = 'INSERT INTO cart (user_id, product_id, quantity, selected_variants, session_id) VALUES (NULL, ?, ?, ?, ?)';
        await db.execute<ResultSetHeader>(insertSql, [cartItem.productId, cartItem.quantity, cartItem.selectedVariants ? JSON.stringify(cartItem.selectedVariants) : null, sessionIdBody]);
      }
    }

    return NextResponse.json({ success: true, message: 'Product validated and ready to add to cart', cartItem, product: { id: product.id, productName: product.productName, productImage: product.productImage, price: product.price, sellingPrice: product.sellingPrice, stockQuantity: product.stockQuantity } });
  } catch (error: any) {
    console.error('ADD TO CART ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, itemId, quantity } = body;

    // Server-side cart update logic can be added here

    return NextResponse.json({
      success: true,
      message: 'Cart item updated',
    });
  } catch (error: any) {
    console.error('UPDATE CART ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const itemId = searchParams.get('itemId');

    // Server-side cart removal logic can be added here

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error: any) {
    console.error('DELETE CART ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}


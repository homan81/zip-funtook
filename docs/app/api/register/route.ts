import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectDB } from '@/config/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const db = await connectDB();

    // check existing
    const [rows] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [email, hash, name || null]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Register error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

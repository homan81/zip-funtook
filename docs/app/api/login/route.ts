import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const db = await connectDB();
    const [rows] = await db.execute('SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1', [email]);
    const userRow = Array.isArray(rows) && (rows as any[])[0];
    if (!userRow) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ sub: String(userRow.id), email: userRow.email }, process.env.NEXTAUTH_SECRET || 'dev_secret', { expiresIn: '7d' });
    return NextResponse.json({ token, user: { id: userRow.id, email: userRow.email, name: userRow.name } });
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

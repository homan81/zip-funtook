import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { connectDB } from '@/config/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET(req: Request) {
  try {
      const db = await connectDB()
      // Use SELECT * to avoid failing when the schema differs slightly between environments.
      const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users ORDER BY id DESC')
      console.log('Fetched users:', rows)
      const users = Array.isArray(rows)
        ? rows.map((r: any) => ({
            id: r.id,
            name: r.name || r.email || null,
            email: r.email || null,
            role: r.role || 'User',
            status: r.status || 'Active',
            lastActive: r.last_active || r.lastActive || null,
            joinDate: r.created_at || r.joinDate || null,
            updatedAt: r.updated_at || r.updatedAt || null,
          }))
        : []
    return NextResponse.json({ success: true, users })
  } catch (err: any) {
    console.error('Admin users list error', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, role, status, password } = body || {}
    if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 })

    const db = await connectDB()
    // check existing
    const [existRows] = await db.execute<RowDataPacket[]>('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
    if (Array.isArray(existRows) && existRows.length > 0) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 })
    }

    const pwd = password || Math.random().toString(36).slice(-8)
    const hash = await bcrypt.hash(pwd, 10)

    // Detect which columns exist in the users table and build INSERT accordingly
    const dbName = process.env.DB_NAME || ''
    const [colsRows] = await db.execute<RowDataPacket[]>(
      'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [dbName, 'users']
    )
    const existingCols = Array.isArray(colsRows) ? colsRows.map((c: any) => String(c.COLUMN_NAME).toLowerCase()) : []

    const insertFields: string[] = []
    const insertPlaceholders: string[] = []
    const insertValues: any[] = []

    if (existingCols.includes('name')) {
      insertFields.push('name')
      insertPlaceholders.push('?')
      insertValues.push(name || null)
    }
    if (existingCols.includes('email')) {
      insertFields.push('email')
      insertPlaceholders.push('?')
      insertValues.push(email)
    }
    if (existingCols.includes('password_hash')) {
      insertFields.push('password_hash')
      insertPlaceholders.push('?')
      insertValues.push(hash)
    }
    if (existingCols.includes('role') && role) {
      insertFields.push('role')
      insertPlaceholders.push('?')
      insertValues.push(role)
    }
    if (existingCols.includes('status') && status) {
      insertFields.push('status')
      insertPlaceholders.push('?')
      insertValues.push(status)
    }

    if (insertFields.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid columns found to insert user' }, { status: 500 })
    }

    const insertSql = `INSERT INTO users (${insertFields.join(',')}) VALUES (${insertPlaceholders.join(',')})`
    const [res] = await db.execute<ResultSetHeader>(insertSql, insertValues)
    const insertId = (res as any).insertId

    // Return the newly created user using SELECT * and defensive mapping
    const [newRow] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [insertId])
    const raw = Array.isArray(newRow) && newRow[0] ? newRow[0] : null
    const user = raw
      ? {
          id: raw.id,
          name: raw.name || raw.email || null,
          email: raw.email || null,
          role: raw.role || 'User',
          status: raw.status || 'Active',
          lastActive: raw.last_active || raw.lastActive || null,
          joinDate: raw.created_at || raw.joinDate || null,
        }
      : null

    return NextResponse.json({ success: true, user: { ...user, password: pwd } })
  } catch (err: any) {
    console.error('Admin create user error', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

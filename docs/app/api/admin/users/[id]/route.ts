import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { connectDB } from '@/config/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function PUT(req: Request, { params }: any) {
  try {
    const { id } = params
    const body = await req.json()
    const { name, email, role, status, password } = body || {}

    const db = await connectDB()
    const dbName = process.env.DB_NAME || ''
    const [colsRows] = await db.execute<RowDataPacket[]>(
      'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [dbName, 'users']
    )
    const existingCols = Array.isArray(colsRows) ? colsRows.map((c: any) => String(c.COLUMN_NAME).toLowerCase()) : []

    const sets: string[] = []
    const vals: any[] = []
    if (existingCols.includes('name') && typeof name !== 'undefined') { sets.push('name = ?'); vals.push(name) }
    if (existingCols.includes('email') && typeof email !== 'undefined') { sets.push('email = ?'); vals.push(email) }
    if (existingCols.includes('role') && typeof role !== 'undefined') { sets.push('role = ?'); vals.push(role) }
    if (existingCols.includes('status') && typeof status !== 'undefined') { sets.push('status = ?'); vals.push(status) }
    if (existingCols.includes('password_hash') && typeof password !== 'undefined') {
      const hash = await bcrypt.hash(password, 10)
      sets.push('password_hash = ?')
      vals.push(hash)
    }

    if (sets.length === 0) return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 })

    const sql = `UPDATE users SET ${sets.join(', ')} WHERE id = ?`
    vals.push(id)
    await db.execute<ResultSetHeader>(sql, vals)

    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
    const user = Array.isArray(rows) && rows[0] ? rows[0] : null
    return NextResponse.json({ success: true, user })
  } catch (err: any) {
    console.error('Admin update user error', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = params
    const db = await connectDB()
    await db.execute('DELETE FROM users WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Admin delete user error', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

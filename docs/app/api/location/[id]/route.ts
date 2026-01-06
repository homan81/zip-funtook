import { NextResponse } from "next/server";
import {connectDB} from "@/config/db";

// UPDATE LOCATION
export async function PUT(req: Request, { params }: any) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    const db = await connectDB();
    await db.execute("UPDATE location SET name=? WHERE id=?", [name, id]);

    return NextResponse.json({ success: true, message: "Location updated" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

// DELETE LOCATION
export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params;

    const db = await connectDB();
    await db.execute("DELETE FROM location WHERE id=?", [id]);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}

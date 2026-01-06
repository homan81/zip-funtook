import { NextResponse } from "next/server";
import {connectDB} from "@/config/db";

// GET ALL LOCATIONS
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM location ORDER BY name ASC");
    return NextResponse.json({ success: true, locations: rows });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to load locations" }, { status: 500 });
  }
}

// CREATE LOCATION
// CREATE LOCATION
export async function POST(req: Request) {
  const db = await connectDB();

  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Location name is required" },
        { status: 400 }
      );
    }

    // Check duplicate name
    const [rows] = await db.execute(
      "SELECT id FROM location WHERE name = ?",
      [name]
    );

    if ((rows as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: "Location name already exists" },
        { status: 400 }
      );
    }

    // Insert new location
    const [result] = await db.execute(
      "INSERT INTO location (name) VALUES (?)",
      [name]
    );

    return NextResponse.json({
      success: true,
      message: "Location added",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to create location" },
      { status: 500 }
    );
  }
}

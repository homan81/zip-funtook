import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
import {connectDB} from "@/config/db";


function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

async function saveImage(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  // create directory if not exist
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/api/uploads/${folder}/${fileName}`;
}
// GET /api/categories
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(`SELECT * FROM categories ORDER BY name ASC`);
    return NextResponse.json({ success: true, categories: rows });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const form = await req.formData();
    const name = (form.get("name") as string)?.trim();
    const imageFile = form.get("image") as unknown as File | null;
    const metaTitle = (form.get("metaTitle") as string) || null;
    const metaKeywords = (form.get("metaKeywords") as string) || null;
    const metaDescription = (form.get("metaDescription") as string) || null;
    const canonicalUrl = (form.get("canonicalUrl") as string) || null;
    const seoSchema = (form.get("seoSchema") as string) || null;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const[existingname]:any = await db.execute("SELECT name FROM categories WHERE name = ?", [name]);
    if (existingname.length > 0) {
      return NextResponse.json(
        { success: false, message: "Name already exists" },
        { status: 400 }
      );
    }

    const slug = slugify(name);
    let imagePath: string | null = null;

    if (imageFile && typeof imageFile === "object") {
      imagePath = await saveImage(imageFile, 'categories');
    }

    // Check which columns exist
    const [colsRows]: any = await db.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
      [process.env.DB_NAME]
    );
    const availableCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));

    const insertCols: string[] = ["name", "slug"];
    const insertVals: any[] = [name, slug];

    if (imagePath && availableCols.has("image")) {
      insertCols.push("image");
      insertVals.push(imagePath);
    }

    if (metaTitle && availableCols.has("metaTitle")) {
      insertCols.push("metaTitle");
      insertVals.push(metaTitle);
    }

    if (metaKeywords && availableCols.has("metaKeywords")) {
      insertCols.push("metaKeywords");
      insertVals.push(metaKeywords);
    }

    if (metaDescription && availableCols.has("metaDescription")) {
      insertCols.push("metaDescription");
      insertVals.push(metaDescription);
    }

    if (canonicalUrl && availableCols.has("canonicalUrl")) {
      insertCols.push("canonicalUrl");
      insertVals.push(canonicalUrl);
    }

    if (seoSchema && availableCols.has("seoSchema")) {
      insertCols.push("seoSchema");
      insertVals.push(seoSchema);
    }

    const placeholders = insertCols.map(() => "?").join(", ");
    const insertSql = `INSERT INTO categories (${insertCols.join(", ")}) VALUES (${placeholders})`;

    await db.execute(insertSql, insertVals);

    return NextResponse.json({ success: true, message: "Category created" });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

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

// GET /api/subcategories
export async function GET() {
  try {
    const db = await connectDB();

    const [rows] = await db.execute(`
      SELECT s.*, c.name AS categoryName 
      FROM subcategories s
      JOIN categories c ON c.id = s.category_id
      ORDER BY c.name ASC, s.name ASC
    `);
    return NextResponse.json({ success: true, subcategories: rows });
  } catch (error) {
    console.error("GET SUBCATEGORIES ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load subcategories" },
      { status: 500 }
    );
  }
}

// POST /api/subcategories
export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const form = await req.formData();
    const category_id = Number(form.get("category_id"));
    const name = (form.get("name") as string)?.trim();
    const imageFile = form.get("image") as unknown as File | null;
    const metaTitle = (form.get("metaTitle") as string) || null;
    const metaKeywords = (form.get("metaKeywords") as string) || null;
    const metaDescription = (form.get("metaDescription") as string) || null;
    const canonicalUrl = (form.get("canonicalUrl") as string) || null;
    const seoSchema = (form.get("seoSchema") as string) || null;

    if (!category_id || !name) {
      return NextResponse.json(
        { success: false, message: "Category and name are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);
    let imagePath: string | null = null;

    if (imageFile && typeof imageFile === "object") {
      imagePath = await saveImage(imageFile, 'subcategories');
    }

    // Check which columns exist
    const [colsRows]: any = await db.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'subcategories'`,
      [process.env.DB_NAME]
    );
    const availableCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));

    const insertCols: string[] = ["category_id", "name", "slug"];
    const insertVals: any[] = [category_id, name, slug];

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
    const insertSql = `INSERT INTO subcategories (${insertCols.join(", ")}) VALUES (${placeholders})`;

    await db.execute(insertSql, insertVals);

    return NextResponse.json({ success: true, message: "Subcategory created" });
  } catch (error) {
    console.error("CREATE SUBCATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create subcategory" },
      { status: 500 }
    );
  }
}

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

async function saveImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "subcategories");
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/subcategories/${fileName}`;
}

// PUT /api/subcategories/[id]
export async function PUT(req: Request, { params }: any) {

  try {
    const { id } = await params;
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

    // get old subcategory
    const [rows]: any = await db.execute(
      `SELECT * FROM subcategories WHERE id = ?`,
      [id]
    );
    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 }
      );
    }

    const old = rows[0];
    const newName = name || old.name;
    const newCategoryId = category_id || old.category_id;
    const slug = slugify(newName);
    let imagePath = old.image;

    if (imageFile && typeof imageFile === "object") {
      imagePath = await saveImage(imageFile);
    }

    // Check which columns exist
    const [colsRows]: any = await db.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'subcategories'`,
      [process.env.DB_NAME]
    );
    const availableCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));

    const updateParts: string[] = ["category_id = ?", "name = ?", "slug = ?"];
    const updateVals: any[] = [newCategoryId, newName, slug];

    if (availableCols.has("image")) {
      updateParts.push("image = ?");
      updateVals.push(imagePath);
    }

    if (metaTitle !== null && availableCols.has("metaTitle")) {
      updateParts.push("metaTitle = ?");
      updateVals.push(metaTitle);
    }

    if (metaKeywords !== null && availableCols.has("metaKeywords")) {
      updateParts.push("metaKeywords = ?");
      updateVals.push(metaKeywords);
    }

    if (metaDescription !== null && availableCols.has("metaDescription")) {
      updateParts.push("metaDescription = ?");
      updateVals.push(metaDescription);
    }

    if (canonicalUrl !== null && availableCols.has("canonicalUrl")) {
      updateParts.push("canonicalUrl = ?");
      updateVals.push(canonicalUrl);
    }

    if (seoSchema !== null && availableCols.has("seoSchema")) {
      updateParts.push("seoSchema = ?");
      updateVals.push(seoSchema);
    }

    updateVals.push(id);
    const updateSql = `UPDATE subcategories SET ${updateParts.join(", ")} WHERE id = ?`;

    await db.execute(updateSql, updateVals);

    return NextResponse.json({ success: true, message: "Subcategory updated" });
  } catch (error) {
    console.error("UPDATE SUBCATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

// DELETE /api/subcategories/[id]
export async function DELETE(req: Request, { params }: any) {

  try {
    const { id } = await params;
    const db = await connectDB();
  
    await db.execute(`DELETE FROM subcategories WHERE id = ?`, [id]);

    return NextResponse.json({ success: true, message: "Subcategory deleted" });
  } catch (error) {
    console.error("DELETE SUBCATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}

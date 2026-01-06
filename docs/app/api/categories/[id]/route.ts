import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
import {connectDB} from "@/config/db";

function slugify(text: string) {
  // Match POST logic and avoid runtime errors
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

  const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/categories/${fileName}`;
}

export async function PUT(req: Request, { params }: any) {

  try {
    const { id } = await params;
    const db = await connectDB();
    const form = await req.formData();
    const name = (form.get("name") as string)?.trim();
    const imageFile = form.get("image") as unknown as File | null;
    const metaTitle = (form.get("metaTitle") as string) || null;
    const metaKeywords = (form.get("metaKeywords") as string) || null;
    const metaDescription = (form.get("metaDescription") as string) || null;
    const canonicalUrl = (form.get("canonicalUrl") as string) || null;
    const seoSchema = (form.get("seoSchema") as string) || null;


    // get old category
    const [rows]: any = await db.execute(
      `SELECT * FROM categories WHERE id = ?`,
      [id]
    );
    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const old = rows[0];
    const newName = name || old.name;
    const slug = slugify(newName);
    let imagePath = old.image;

    if (imageFile && typeof imageFile === "object") {
      imagePath = await saveImage(imageFile);
    }

    // Check which columns exist
    const [colsRows]: any = await db.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
      [process.env.DB_NAME]
    );
    const availableCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));

    const updateParts: string[] = ["name = ?", "slug = ?"];
    const updateVals: any[] = [newName, slug];

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
    const updateSql = `UPDATE categories SET ${updateParts.join(", ")} WHERE id = ?`;

    await db.execute(updateSql, updateVals);

    return NextResponse.json({ success: true, message: "Category updated" });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(req: Request, { params }: any) {

  try {
    const { id } = await params;
    const db = await connectDB();
    await db.execute(`DELETE FROM categories WHERE id = ?`, [id]);

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}

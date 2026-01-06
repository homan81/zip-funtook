// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import {connectDB} from "@/config/db";
import type { RowDataPacket } from "mysql2";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
 //type Params = { params: { productId: number } };

// export async function DELETE(req: Request, { params }: Params) {
  
//     const { id } =  params;
 
// console.log("DELETE REQUEST RECEIVED FOR ID:", id);


//   if (!id) {
//     return NextResponse.json(
//       { success: false, message: "Invalid product ID" },
//       { status: 400 }
//     );
//   }

//   let db: any;
//   try {
//     db = await dbectDB();
//     await db.beginTransaction();

//     // 1) Delete variant options (child of product_variants)
//     // Use parameterized query; id is always a valid number here
//     await db.query(
//       "DELETE vo FROM variant_options vo INNER JOIN product_variants pv ON vo.variant_id = pv.id WHERE pv.product_id = ?",
//       [id]
//     );

//     // 2) Delete product_variants
//     await db.query("DELETE FROM product_variants WHERE product_id = ?", [id]);

//     // 3) Delete product_gallery
//     await db.query("DELETE FROM product_gallery WHERE product_id = ?", [id]);

//     // 4) Delete faqs, package inclusion, delivery, care info (other children)
//     await db.query("DELETE FROM product_faqs WHERE product_id = ?", [id]);
//     await db.query("DELETE FROM product_package_inclusion WHERE product_id = ?", [id]);
//     await db.query("DELETE FROM product_delivery_details WHERE product_id = ?", [id]);
//     await db.query("DELETE FROM product_care_info WHERE product_id = ?", [id]);

//     // 5) Finally delete the product itself
//     await db.query("DELETE FROM products WHERE id = ?", [id]);

//     // commit
//     await db.commit();
//     return NextResponse.json({ success: true, message: "Product deleted successfully" });
//   } catch (err) {
//     // rollback if possible
//     try {
//       if (db) await db.rollback();
//     } catch (rollbackErr) {
//       console.error("Rollback error:", rollbackErr);
//     }
//     console.error("DELETE PRODUCT ERROR:", err);
//     return NextResponse.json(
//       { success: false, message: "Failed to delete product" },
//       { status: 500 }
//     );
//   } finally {
//     // release dbection back to pool
//     try {
//       if (db) await db.release();
//     } catch (releaseErr) {
//       console.error("dbection release error:", releaseErr);
//     }
//   }
// }

//get and return a product by id

function safeParseArray(value: any) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value
        .replace(/[\[\]]/g, "")
        .split(",")
        .map((x) => x.replace(/"/g, "").trim())
        .filter(Boolean);
    }
  }

  return [];
}


export async function GET(req: Request, { params }: any) {
  try {
    const {id } = await params;
const productId = id;
    const db = await connectDB();

    //console.log("edit product id:", productId);


    const [product] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    // console.log("Fetched product:", product);
    if (product.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const [gallery] = await db.execute <RowDataPacket[]>(
      `SELECT * FROM product_gallery WHERE product_id = ?`,
      [productId]
    );

    const [variants] = await db.execute <RowDataPacket[]>(
      `SELECT * FROM product_variants WHERE product_id = ?`,
      [productId]
    );

  //  console.log("Fetched variants:", variants.map((v) => v.id));
  //   const [variantOptions] = await db.execute <RowDataPacket[]>(
  //     `SELECT * FROM variant_options WHERE variant_id = ?`,
  //     []
  //   );
  // 4️⃣ Fetch variant options ONLY if variants exist
  let variantOptions: RowDataPacket[] = [];

  if (variants.length > 0) {
    const variantIds = variants.map((v) => v.id);
    const placeholders = variantIds.map(() => "?").join(",");

    const [options] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM variant_options WHERE variant_id IN (${placeholders})`,
      variantIds
    );

    variantOptions = options;
  }

    const [faqs] = await db.execute <RowDataPacket[]>(
      `SELECT * FROM product_faqs WHERE product_id = ?`,
      [productId]
    );

    const [pkg] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM product_package_inclusion WHERE product_id = ?`,
      [productId]
    );

    const [delivery] = await db.execute <RowDataPacket[]>(
      `SELECT * FROM product_delivery_details WHERE product_id = ?`,
      [productId]
    );

    const [care] = await db.execute <RowDataPacket[]>(
      `SELECT * FROM product_care_info WHERE product_id = ?`,
      [productId]
    );

    return NextResponse.json({
      success: true,
      product: {
        ...product[0],
        // FIX 1: Convert saved string to array
        locationAvailability: safeParseArray(product[0].locationAvailability),
        product_tags: safeParseArray(product[0].product_tags),
        gallery,
        faqs,
        packageInclusion: pkg.map((p) => p.item),
        deliveryDetails: delivery.map((d) => d.item),
        careInfo: care.map((c) => c.item),
        variants: variants.map((v) => ({
          id: v.id,
          name: v.name,
          options: variantOptions
            .filter((o) => o.variant_id === v.id)
            .map((o) => o.optionValue),
        })),
      },
    });
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


// DELETE PRODUCT AND ALL ASSOCIATED DATA

// Helper function to extract array from FormData
function extractArray(form: FormData, field: string) {
  const arr: string[] = [];
  for (const [key, value] of form.entries()) {
    if (key.startsWith(`${field}[`)) {
      arr.push(value as string);
    }
  }
  return arr;
}

// Helper function to save file
async function saveFile(file: File, folder: string) {
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

export async function PUT(req: Request, { params }: any) {
  let db: any;
  try {
    const { id } = await params;
    console.log("Updating product with ID:", id);
    const form = await req.formData();

    db = await connectDB();
    // await db.beginTransaction();

    // ---------------- EXTRACT PRODUCT DATA ----------------
    const productName = form.get("productName") as string;
    const slug = form.get("slug") as string;
    const description = form.get("description") as string;
    const category_id = form.get("category_id") ? parseInt(form.get("category_id") as string) : null;
    const category = form.get("category") as string || "";
    const subcategory_id = form.get("subcategory_id") ? parseInt(form.get("subcategory_id") as string) : null;
    const subcategory = form.get("subcategory") as string || "";

    // Pricing fields - handle both 'price' and 'mrp' for compatibility
    const priceValue = form.get("price") || form.get("mrp");
    const price = parseFloat(priceValue as string);
    const sellingPrice = parseFloat(form.get("sellingPrice") as string);
    const discountPercent = parseFloat(form.get("discountPercent") as string) || 0;
    const quantity = parseInt(form.get("quantity") as string) || 0;
    const unit = form.get("unit") as string || "";
    const stockQuantity = parseInt(form.get("stockQuantity") as string) || 0;

    // Extract arrays
    const product_tags = extractArray(form, "product_tags");
    const locationAvailability = extractArray(form, "locationAvailability");
    const product_tags_json = JSON.stringify(product_tags);
    const location_json = JSON.stringify(locationAvailability);

    // ---------------- PRODUCT IMAGE ----------------
    const existingProductImage = form.get("existingProductImage") as string;
    const productImageFile = form.get("productImage") as unknown as File;
    let productImageUrl = existingProductImage;

    if (productImageFile && productImageFile.size > 0) {
      productImageUrl = await saveFile(productImageFile, "products");
    }

    // ---------------- UPDATE PRODUCT ----------------
    // detect available columns in products table
    const [colsRows]: any = await db.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'`,
      [process.env.DB_NAME]
    );
    const availableCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));

    const updateParts: string[] = [];
    const updateVals: any[] = [];

    function addIfAvailable(colName: string, value: any) {
      if (availableCols.has(colName)) {
        updateParts.push(`${colName} = ?`);
        updateVals.push(value);
      }
    }

    addIfAvailable("productName", productName);
    addIfAvailable("slug", slug);
    addIfAvailable("product_tags", product_tags_json);
    addIfAvailable("description", description);
    if (category_id) addIfAvailable("category_id", category_id);
    if (category) addIfAvailable("category", category);
    if (subcategory_id) addIfAvailable("subcategory_id", subcategory_id);
    if (subcategory) addIfAvailable("subcategory", subcategory);
    addIfAvailable("productImage", productImageUrl);
    addIfAvailable("price", price);
    addIfAvailable("sellingPrice", sellingPrice);
    addIfAvailable("discountPercent", discountPercent);
    addIfAvailable("quantity", quantity);
    addIfAvailable("unit", unit);
    addIfAvailable("stockQuantity", stockQuantity);
    addIfAvailable("locationAvailability", location_json);

    // SEO fields from the form
    const metaTitle = (form.get("metaTitle") as string) || null;
    const metaKeywords = (form.get("metaKeywords") as string) || null;
    const metaDescription = (form.get("metaDescription") as string) || null;
    const canonicalUrl = (form.get("canonicalUrl") as string) || null;
    const seoSchema = (form.get("seoSchema") as string) || null;

    addIfAvailable("metaTitle", metaTitle);
    addIfAvailable("metaKeywords", metaKeywords);
    addIfAvailable("metaDescription", metaDescription);
    addIfAvailable("canonicalUrl", canonicalUrl);
    addIfAvailable("seoSchema", seoSchema);

    if (updateParts.length > 0) {
      const sql = `UPDATE products SET ${updateParts.join(", ")} WHERE id = ?`;
      updateVals.push(id);
      await db.execute(sql, updateVals);
    }

    // ---------------- DELETE EXISTING RELATED DATA ----------------
    // Delete variant options
    await db.query(
      "DELETE vo FROM variant_options vo INNER JOIN product_variants pv ON vo.variant_id = pv.id WHERE pv.product_id = ?",
      [id]
    );
    // Delete variants
    await db.query("DELETE FROM product_variants WHERE product_id = ?", [id]);
    // Delete FAQs
    await db.query("DELETE FROM product_faqs WHERE product_id = ?", [id]);
    // Delete package inclusion
    await db.query("DELETE FROM product_package_inclusion WHERE product_id = ?", [id]);
    // Delete delivery details
    await db.query("DELETE FROM product_delivery_details WHERE product_id = ?", [id]);
    // Delete care info
    await db.query("DELETE FROM product_care_info WHERE product_id = ?", [id]);

    // ---------------- HANDLE GALLERY IMAGES ----------------
    // Get existing gallery images that should be kept
    const existingGalleryImages: string[] = [];
    let existingIdx = 0;
    while (form.get(`existingGalleryImages[${existingIdx}]`)) {
      const url = form.get(`existingGalleryImages[${existingIdx}]`) as string;
      existingGalleryImages.push(url);
      existingIdx++;
    }

    // Delete all existing gallery images
    await db.query("DELETE FROM product_gallery WHERE product_id = ?", [id]);

    // Re-insert existing gallery images that should be kept
    for (const url of existingGalleryImages) {
      await db.execute(
        `INSERT INTO product_gallery (product_id, image) VALUES (?, ?)`,
        [id, url]
      );
    }

    // Add new gallery images
    let galleryIndex = 0;
    while (form.get(`galleryImages[${galleryIndex}]`)) {
      const file = form.get(`galleryImages[${galleryIndex}]`) as unknown as File;
      if (file && file.size > 0) {
        const fileUrl = await saveFile(file, "products");
        await db.execute(
          `INSERT INTO product_gallery (product_id, image) VALUES (?, ?)`,
          [id, fileUrl]
        );
      }
      galleryIndex++;
    }

    // Add gallery images from media library (URLs)
    const galleryUrls: string[] = [];
    for (const [key, value] of form.entries()) {
      if (key === 'galleryImageUrls[]') {
        galleryUrls.push(value as string);
      }
    }

    for (const url of galleryUrls) {
      await db.execute(
        `INSERT INTO product_gallery (product_id, image) VALUES (?, ?)`,
        [id, url]
      );
    }

    // ---------------- VARIANTS & OPTIONS ----------------
    let variantIndex = 0;
    while (form.get(`variants[${variantIndex}][name]`)) {
      const variantName = form.get(`variants[${variantIndex}][name]`) as string;

      // Insert variant
      const [variantResult]: any = await db.execute(
        `INSERT INTO product_variants (product_id, name) VALUES (?, ?)`,
        [id, variantName]
      );

      const variantId = variantResult.insertId;

      // Insert options
      let optionIndex = 0;
      while (form.get(`variants[${variantIndex}][options][${optionIndex}]`)) {
        const option = form.get(
          `variants[${variantIndex}][options][${optionIndex}]`
        ) as string;

        if (option && option.trim()) {
          await db.execute(
            `INSERT INTO variant_options (variant_id, optionValue) VALUES (?, ?)`,
            [variantId, option]
          );
        }

        optionIndex++;
      }

      variantIndex++;
    }

    // ---------------- FAQs ----------------
    let faqIndex = 0;
    while (form.get(`faqs[${faqIndex}][question]`)) {
      const question = form.get(`faqs[${faqIndex}][question]`) as string;
      const answer = form.get(`faqs[${faqIndex}][answer]`) as string;

      if (question || answer) {
        await db.execute(
          `INSERT INTO product_faqs (product_id, question, answer)
           VALUES (?, ?, ?)`,
          [id, question || "", answer || ""]
        );
      }

      faqIndex++;
    }

    // ---------------- LIST SECTIONS ----------------

    // Package Inclusion
    let piIndex = 0;
    while (form.get(`packageInclusion[${piIndex}]`)) {
      const value = form.get(`packageInclusion[${piIndex}]`) as string;
      if (value && value.trim()) {
        await db.execute(
          `INSERT INTO product_package_inclusion (product_id, item)
           VALUES (?, ?)`,
          [id, value]
        );
      }
      piIndex++;
    }

    // Delivery Details
    let ddIndex = 0;
    while (form.get(`deliveryDetails[${ddIndex}]`)) {
      const value = form.get(`deliveryDetails[${ddIndex}]`) as string;
      if (value && value.trim()) {
        await db.execute(
          `INSERT INTO product_delivery_details (product_id, item)
           VALUES (?, ?)`,
          [id, value]
        );
      }
      ddIndex++;
    }

    // Care Info
    let ciIndex = 0;
    while (form.get(`careInfo[${ciIndex}]`)) {
      const value = form.get(`careInfo[${ciIndex}]`) as string;
      if (value && value.trim()) {
        await db.execute(
          `INSERT INTO product_care_info (product_id, item)
           VALUES (?, ?)`,
          [id, value]
        );
      }
      ciIndex++;
    }

    //await db.commit();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (e: any) {
    console.log("PUT PRODUCT ERROR:", e);
    // Rollback transaction on error
    try {
      if (db) await db.rollback();
    } catch (rollbackErr) {
      console.error("Rollback error:", rollbackErr);
    }
    return NextResponse.json(
      { success: false, message: e.message || "Failed to update product" },
      { status: 500 }
    );
  } finally {
    // Release connection
    try {
      if (db) await db.release();
    } catch (releaseErr) {
      console.error("Connection release error:", releaseErr);
    }
  }
}


export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params;

    const db = await connectDB();

    console.log("Deleting product with ID:", id);



    // 1) Delete variant options (child of product_variants)
//     // Use parameterized query; id is always a valid number here
    await db.query(
      "DELETE vo FROM variant_options vo INNER JOIN product_variants pv ON vo.variant_id = pv.id WHERE pv.product_id = ?",
      [id]
    );

//     // 2) Delete product_variants
    await db.query("DELETE FROM product_variants WHERE product_id = ?", [id]);

//     // 3) Delete product_gallery
    await db.query("DELETE FROM product_gallery WHERE product_id = ?", [id]);

//     // 4) Delete faqs, package inclusion, delivery, care info (other children)
    await db.query("DELETE FROM product_faqs WHERE product_id = ?", [id]);
    await db.query("DELETE FROM product_package_inclusion WHERE product_id = ?", [id]);
    await db.query("DELETE FROM product_delivery_details WHERE product_id = ?", [id]);
    await db.query("DELETE FROM product_care_info WHERE product_id = ?", [id]);

//     // 5) Finally delete the product itself
//     await db.query("DELETE FROM products WHERE id = ?", [id]);


    await db.execute("DELETE FROM products WHERE id=?", [id]);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}

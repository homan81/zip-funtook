import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
//import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";
//import connectconn from "@/config/db";
import { connectDB } from "@/config/db";

// ------------------- DATABASE CONNECTION -------------------




// ------------------- SAVE FILE FUNCTION -------------------


// async function saveFile(file: File, folder: string) {
//   const bytes = await file.arrayBuffer()
//   const buffer = Buffer.from(bytes)

//   const uploadDir = path.join(process.cwd(), 'uploads', folder)

//   if (!fs.existsSync(uploadDir)) {
//     await mkdir(uploadDir, { recursive: true })
//   }

//   const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
//   const filePath = path.join(uploadDir, fileName)

//   fs.writeFileSync(filePath, buffer)

//   // STORE ONLY FILENAME
//   return fileName
// }



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
// async function saveFile(file: File, folder: string) {
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

//   // create directory if not exist
//   if (!fs.existsSync(uploadDir)) {
//     await mkdir(uploadDir, { recursive: true });
//   }

//   const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
//   const filePath = path.join(uploadDir, fileName);

//   fs.writeFileSync(filePath, buffer);

//   return `/uploads/${folder}/${fileName}`;
// }

// ------------------- API HANDLER -------------------

export async function POST(req: Request) {



  function extractArray(form: FormData, field: string) {
    const arr: string[] = [];
    for (const [key, value] of form.entries()) {
      if (key.startsWith(`${field}[`)) {
        arr.push(value as string);
      }
    }
    return arr;
  }
  
  
  
  try {
    const form = await req.formData();

    console.log("=== ADD PRODUCT API ===");
    console.log("category_id from form:", form.get("category_id"));
    console.log("subcategory_id from form:", form.get("subcategory_id"));

    // ---------------- PRODUCT DATA ----------------
    const productName = form.get("productName") as string;
    const slug = form.get("slug") as string;
    const description = form.get("description") as string;
    const category_id = form.get("category_id") ? parseInt(form.get("category_id") as string) : null;
    const category = form.get("category") as string || "";
    const subcategory_id = form.get("subcategory_id") ? parseInt(form.get("subcategory_id") as string) : null;
    const subcategory = form.get("subcategory") as string || "";
   
    console.log("category_id:", category_id);
    console.log("category:", category);
    console.log("subcategory_id:", subcategory_id);
    console.log("subcategory:", subcategory);

    const mrp = parseFloat(form.get("mrp") as string);
    const sellingPrice = parseFloat(form.get("sellingPrice") as string);
    const discountPercent = parseFloat(form.get("discountPercent") as string);

    const quantity = parseInt(form.get("quantity") as string);
    const unit = form.get("unit") as string;
    const stockQuantity = parseInt(form.get("stockQuantity") as string);


    //product tags and location availability
    const product_tags = extractArray(form, "product_tags");
const locationAvailability = extractArray(form, "locationAvailability");
   // const locationAvailability = form.get("locationAvailability") as string;
  //console.log("PRODUCT TAGS:", product_tags);

  const product_tags_json = JSON.stringify(product_tags);
const location_json = JSON.stringify(locationAvailability);


    // ---------------- PRODUCT IMAGE ----------------
    const productImageFile = form.get("productImage") as unknown as File;
    let productImageUrl = (form.get("productImageUrl") as string) || null;

    if (!productImageFile && !productImageUrl) {
      return NextResponse.json(
        { status: 400, message: "Product image is required" },
        { status: 400 }
      );
    }

    if (productImageFile) {
      productImageUrl = await saveFile(productImageFile, "products");
    }

    // ---------------- INSERT PRODUCT ----------------
    const conn = await connectDB();

    // detect available columns for products table to avoid failing when schema differs
    const [colsRows]: any = await conn.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'`,
      [process.env.DB_NAME]
    );
    const availableCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));
    
    console.log("Available columns:", Array.from(availableCols));
    console.log("Has category_id column:", availableCols.has("category_id"));
    console.log("Has subcategory_id column:", availableCols.has("subcategory_id"));

    const insertCols: string[] = [
      "productName",
      "slug",
      "product_tags",
      "description",
      "productImage",
      "price",
      "sellingPrice",
      "discountPercent",
      "quantity",
      "unit",
      "stockQuantity",
      "locationAvailability",
    ];

    const insertVals: any[] = [
      productName,
      slug,
      product_tags_json,
      description,
      productImageUrl,
      mrp,
      sellingPrice,
      discountPercent,
      quantity,
      unit,
      stockQuantity,
      location_json,
    ];

    // Add category and category_id
    if (category_id !== null && category_id !== undefined && availableCols.has("category_id")) {
      insertCols.push("category_id");
      insertVals.push(category_id);
      console.log("Adding category_id to insert:", category_id);
    }
    if (category && availableCols.has("category")) {
      insertCols.push("category");
      insertVals.push(category);
      console.log("Adding category to insert:", category);
    }
    
    // Add subcategory and subcategory_id
    if (subcategory_id !== null && subcategory_id !== undefined && availableCols.has("subcategory_id")) {
      insertCols.push("subcategory_id");
      insertVals.push(subcategory_id);
      console.log("Adding subcategory_id to insert:", subcategory_id);
    }
    if (subcategory && availableCols.has("subcategory")) {
      insertCols.push("subcategory");
      insertVals.push(subcategory);
      console.log("Adding subcategory to insert:", subcategory);
    }

    // optional SEO fields added by the admin UI
    const metaTitle = (form.get("metaTitle") as string) || null;
    const metaKeywords = (form.get("metaKeywords") as string) || null;
    const metaDescription = (form.get("metaDescription") as string) || null;
    const canonicalUrl = (form.get("canonicalUrl") as string) || null;
    const seoSchema = (form.get("seoSchema") as string) || null;

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

    // always set created_at if column exists
    if (availableCols.has("created_at")) {
      insertCols.push("created_at");
      insertVals.push(new Date());
    }

    const placeholders = insertCols.map(() => "?").join(", ");
    const insertSql = `INSERT INTO products (${insertCols.join(", ")}) VALUES (${placeholders})`;

    const [productResult]: any = await conn.execute(insertSql, insertVals);

    const productId = productResult.insertId;

    // ---------------- GALLERY IMAGES ----------------
    // 1) Files uploaded as galleryImages[0], galleryImages[1], ...
    let galleryIndex = 0;
    while (form.get(`galleryImages[${galleryIndex}]`)) {
      const file = form.get(`galleryImages[${galleryIndex}]`) as unknown as File;
      const fileUrl = await saveFile(file, "products");

      await conn.execute(
        `INSERT INTO product_gallery (product_id, image) VALUES (?, ?)`,
        [productId, fileUrl]
      );

      galleryIndex++;
    }

    // 2) URLs from media library appended as repeated 'galleryImageUrls[]'
    const galleryUrls: string[] = [];
    for (const [key, value] of form.entries()) {
      if (key === 'galleryImageUrls[]') {
        galleryUrls.push(value as string);
      }
    }

    for (const url of galleryUrls) {
      await conn.execute(
        `INSERT INTO product_gallery (product_id, image) VALUES (?, ?)`,
        [productId, url]
      );
    }

    // ---------------- VARIANTS & OPTIONS ----------------
    let variantIndex = 0;

    while (form.get(`variants[${variantIndex}][name]`)) {
      const variantName = form.get(`variants[${variantIndex}][name]`) as string;

      // Insert variant
      const [variantResult]: any = await conn.execute(
        `INSERT INTO product_variants (product_id, name) VALUES (?, ?)`,
        [productId, variantName]
      );

      const variantId = variantResult.insertId;

      // Insert options
      let optionIndex = 0;

      while (form.get(`variants[${variantIndex}][options][${optionIndex}]`)) {
        const option = form.get(
          `variants[${variantIndex}][options][${optionIndex}]`
        ) as string;

        await conn.execute(
          `INSERT INTO variant_options (variant_id, optionValue) VALUES (?, ?)`,
          [variantId, option]
        );

        optionIndex++;
      }

      variantIndex++;
    }

    // ---------------- FAQs ----------------
    let faqIndex = 0;

    while (form.get(`faqs[${faqIndex}][question]`)) {
      const question = form.get(`faqs[${faqIndex}][question]`) as string;
      const answer = form.get(`faqs[${faqIndex}][answer]`) as string;

      await conn.execute(
        `INSERT INTO product_faqs (product_id, question, answer)
         VALUES (?, ?, ?)`,
        [productId, question, answer]
      );

      faqIndex++;
    }

    // ---------------- LIST SECTIONS ----------------

    // Package Inclusion
    let piIndex = 0;
    while (form.get(`packageInclusion[${piIndex}]`)) {
      const value = form.get(`packageInclusion[${piIndex}]`) as string;

      await conn.execute(
        `INSERT INTO product_package_inclusion (product_id, item)
         VALUES (?, ?)`,
        [productId, value]
      );

      piIndex++;
    }

    // Delivery Details
    let ddIndex = 0;
    while (form.get(`deliveryDetails[${ddIndex}]`)) {
      const value = form.get(`deliveryDetails[${ddIndex}]`) as string;

      await conn.execute(
        `INSERT INTO product_delivery_details (product_id, item)
         VALUES (?, ?)`,
        [productId, value]
      );

      ddIndex++;
    }

    // Care Info
    let ciIndex = 0;
    while (form.get(`careInfo[${ciIndex}]`)) {
      const value = form.get(`careInfo[${ciIndex}]`) as string;

      await conn.execute(
        `INSERT INTO product_care_info (product_id, item)
         VALUES (?, ?)`,
        [productId, value]
      );

      ciIndex++;
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Product created successfully",
        data: { productId },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { status: 500, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}



//get products


export async function GET(req: Request) {
  try {
   
//const conn = await connectconn()

const conn = await connectDB()

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Search
    const search = searchParams.get("search") || "";

    // Filters
    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";

    // Sorting
    const sort = searchParams.get("sort") || "newest";

    let sortQuery = "ORDER BY id DESC"; // default
    if (sort === "oldest") sortQuery = "ORDER BY id ASC";
    if (sort === "price_asc") sortQuery = "ORDER BY sellingPrice ASC";
    if (sort === "price_desc") sortQuery = "ORDER BY sellingPrice DESC";

    // 1️⃣ Build WHERE conditions
    let where = "WHERE 1=1";

    if (search) {
      where += ` AND productName LIKE '%${search}%'`;
    }

    if (category) {
      where += ` AND category = '${category}'`;
    }

    if (subcategory) {
      where += ` AND subcategory = '${subcategory}'`;
    }

    // 2️⃣ Count total filtered products
    const [countResult] = await conn.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS total FROM products ${where}
    `);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // 3️⃣ Fetch paginated filtered products
    const [products] = await conn.execute <RowDataPacket[]>(`
      SELECT * FROM products
      ${where}
      ${sortQuery}
      LIMIT ${limit} OFFSET ${offset}
    `);

    // 4️⃣ Fetch Additional Data (existing logic stays same)
    const [
      galleryRows,
      variantRows,
      optionRows,
      faqRows,
      pkgRows,
      deliveryRows,
      careRows
    ] = await Promise.all([
      conn.execute <RowDataPacket[]>(`SELECT * FROM product_gallery`).then((r) => r[0]),
     conn.execute<RowDataPacket[]>(`SELECT * FROM product_variants`).then((r) => r[0]),
      conn.execute<RowDataPacket[]>(`SELECT * FROM variant_options`).then((r) => r[0]),
      conn.execute<RowDataPacket[]>(`SELECT * FROM product_faqs`).then((r) => r[0]),
      conn.execute<RowDataPacket[]>(`SELECT * FROM product_package_inclusion`).then((r) => r[0]),
      conn.execute<RowDataPacket[]>(`SELECT * FROM product_delivery_details`).then((r) => r[0]),
      conn.execute<RowDataPacket[]>(`SELECT * FROM product_care_info`).then((r) => r[0])
    ]);

    // 5️⃣ Merge Data
    const finalData = products.map((product) => ({
      ...product,

    productImage: product.productImage,


      gallery: galleryRows
        .filter((g) => g.product_id === product.id)
        .map((g) => `/uploads/products/${g.image}`),

      variants: variantRows
        .filter((v) => v.product_id === product.id)
        .map((variant) => ({
          id: variant.id,
          name: variant.name,
          options: optionRows
            .filter((opt) => opt.variant_id === variant.id)
            .map((o) => o.optionValue),
        })),

      faqs: faqRows
        .filter((f) => f.product_id === product.id)
        .map((f) => ({ question: f.question, answer: f.answer })),

      packageInclusion: pkgRows
        .filter((p) => p.product_id === product.id)
        .map((p) => p.item),

      deliveryDetails: deliveryRows
        .filter((d) => d.product_id === product.id)
        .map((d) => d.item),

      careInfo: careRows
        .filter((c) => c.product_id === product.id)
        .map((c) => c.item)
    }));

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalItems,
      totalPages,
      products: finalData,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

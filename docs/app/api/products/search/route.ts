import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import type { RowDataPacket } from "mysql2";

// ------------------- CORS HEADERS -------------------

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: corsHeaders 
  });
}

// ------------------- INTERFACES -------------------

interface SearchFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: Array<number | string>;
  subcategories?: Array<number | string>;
  tags?: Array<number | string>;
  cities?: Array<number | string>;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ------------------- HELPER FUNCTIONS -------------------

/**
 * Sanitize and validate search filters
 */
function sanitizeFilters(body: any): SearchFilters {
  const filters: SearchFilters = {};

  // Search text
  if (body.search && typeof body.search === "string" && body.search.trim()) {
    filters.search = body.search.trim();
  }

  // Price range
  if (body.minPrice !== undefined && body.minPrice !== null) {
    const min = parseFloat(body.minPrice);
    if (!isNaN(min) && min >= 0) {
      filters.minPrice = min;
    }
  }

  if (body.maxPrice !== undefined && body.maxPrice !== null) {
    const max = parseFloat(body.maxPrice);
    if (!isNaN(max) && max >= 0) {
      filters.maxPrice = max;
    }
  }

  // Categories (array of id or name)
  if (Array.isArray(body.categories) && body.categories.length > 0) {
    filters.categories = body.categories.filter((c: any) => 
      c !== null && c !== undefined && c !== ""
    );
  }

  // Subcategories (array of id or name)
  if (Array.isArray(body.subcategories) && body.subcategories.length > 0) {
    filters.subcategories = body.subcategories.filter((s: any) => 
      s !== null && s !== undefined && s !== ""
    );
  }

  // Tags (array of id or name)
  if (Array.isArray(body.tags) && body.tags.length > 0) {
    filters.tags = body.tags.filter((t: any) => 
      t !== null && t !== undefined && t !== ""
    );
  }

  // Cities (array of city name or id)
  if (Array.isArray(body.cities) && body.cities.length > 0) {
    filters.cities = body.cities.filter((c: any) => 
      c !== null && c !== undefined && c !== ""
    );
  }

  // Pagination
  filters.page = body.page && !isNaN(parseInt(body.page)) ? Math.max(1, parseInt(body.page)) : 1;
  filters.limit = body.limit && !isNaN(parseInt(body.limit)) ? Math.min(100, Math.max(1, parseInt(body.limit))) : 10;

  // Sorting
  const validSorts = ["newest", "oldest", "price_asc", "price_desc", "name_asc", "name_desc"];
  filters.sortBy = validSorts.includes(body.sortBy) ? body.sortBy : "newest";

  return filters;
}

/**
 * Build dynamic WHERE clause and parameters
 */
function buildWhereClause(filters: SearchFilters): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  // Search in product name and description
  if (filters.search) {
    conditions.push("(p.productName LIKE ? OR p.description LIKE ?)");
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  // Price range filters
  if (filters.minPrice !== undefined) {
    conditions.push("p.sellingPrice >= ?");
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    conditions.push("p.sellingPrice <= ?");
    params.push(filters.maxPrice);
  }

  // Categories filter (using category_id for numbers and category for names)
  if (filters.categories && filters.categories.length > 0) {
    const categoryConditions: string[] = [];
    
    filters.categories.forEach((cat) => {
      // Support numeric IDs - check category_id column
      const catNum = Number(cat);
      if (!isNaN(catNum) && cat !== "") {
        categoryConditions.push("p.category_id = ?");
        params.push(catNum);
      } else if (typeof cat === "string" && cat.trim()) {
        // Support string names - check category column
        categoryConditions.push("p.category = ?");
        params.push(cat.trim());
      }
    });

    if (categoryConditions.length > 0) {
      conditions.push(`(${categoryConditions.join(" OR ")})`);
    }
  }

  // Subcategories filter (using subcategory_id for numbers and subcategory for names)
  if (filters.subcategories && filters.subcategories.length > 0) {
    const subcategoryConditions: string[] = [];
    
    filters.subcategories.forEach((subcat) => {
      // Support numeric IDs - check subcategory_id column
      const subcatNum = Number(subcat);
      if (!isNaN(subcatNum) && subcat !== "") {
        subcategoryConditions.push("p.subcategory_id = ?");
        params.push(subcatNum);
      } else if (typeof subcat === "string" && subcat.trim()) {
        // Support string names - check subcategory column
        subcategoryConditions.push("p.subcategory = ?");
        params.push(subcat.trim());
      }
    });

    if (subcategoryConditions.length > 0) {
      conditions.push(`(${subcategoryConditions.join(" OR ")})`);
    }
  }

  // Tags filter (JSON search in product_tags column)
  if (filters.tags && filters.tags.length > 0) {
    const tagConditions: string[] = [];
    
    filters.tags.forEach((tag) => {
      tagConditions.push("JSON_CONTAINS(p.product_tags, ?)");
      params.push(JSON.stringify(String(tag)));
    });

    if (tagConditions.length > 0) {
      conditions.push(`(${tagConditions.join(" OR ")})`);
    }
  }

  // Cities/Location availability filter (JSON search)
  if (filters.cities && filters.cities.length > 0) {
    const cityConditions: string[] = [];
    
    filters.cities.forEach((city) => {
      cityConditions.push("JSON_CONTAINS(p.locationAvailability, ?)");
      params.push(JSON.stringify(String(city)));
    });

    if (cityConditions.length > 0) {
      conditions.push(`(${cityConditions.join(" OR ")})`);
    }
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { where, params };
}

/**
 * Get ORDER BY clause
 */
function getOrderByClause(sortBy: string): string {
  switch (sortBy) {
    case "oldest":
      return "ORDER BY p.id ASC";
    case "price_asc":
      return "ORDER BY p.sellingPrice ASC";
    case "price_desc":
      return "ORDER BY p.sellingPrice DESC";
    case "name_asc":
      return "ORDER BY p.productName ASC";
    case "name_desc":
      return "ORDER BY p.productName DESC";
    case "newest":
    default:
      return "ORDER BY p.id DESC";
  }
}

/**
 * Calculate pagination metadata
 */
function getPaginationMeta(
  currentPage: number,
  limit: number,
  totalItems: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Parse JSON fields safely
 */
function safeParseJSON(value: any): any[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
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

// ------------------- POST HANDLER -------------------

export async function POST(req: Request) {
  let conn: any;

  try {
    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const filters = sanitizeFilters(body);

    // Connect to database
    const conn = await connectDB();

    // Build dynamic WHERE clause
    const { where, params } = buildWhereClause(filters);

    // Count total items
    const countQuery = `SELECT COUNT(*) as total FROM products p ${where}`;
    const [countResult] = await conn.execute<RowDataPacket[]>(countQuery, params);
    const totalItems = countResult[0]?.total || 0;

    // Calculate pagination
    const pagination = getPaginationMeta(filters.page!, filters.limit!, totalItems);

    // Return empty result if no products found
    if (totalItems === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination,
        filters: filters,
      }, { headers: corsHeaders });
    }

    // Build final query with pagination
    const offset = (filters.page! - 1) * filters.limit!;
    const orderBy = getOrderByClause(filters.sortBy!);

    const query = `
      SELECT 
        p.*
      FROM products p
      ${where}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, filters.limit, offset];
    const [products] = await conn.execute<RowDataPacket[]>(query, queryParams);

    // Fetch related data for all products
    const productIds = products.map((p) => p.id);

    let galleryRows: RowDataPacket[] = [];
    let variantRows: RowDataPacket[] = [];
    let optionRows: RowDataPacket[] = [];

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => "?").join(",");

      [galleryRows, variantRows, optionRows] = await Promise.all([
        conn
          .execute<RowDataPacket[]>(
            `SELECT * FROM product_gallery WHERE product_id IN (${placeholders})`,
            productIds
          )
          .then((r: any) => r[0]),
        conn
          .execute<RowDataPacket[]>(
            `SELECT * FROM product_variants WHERE product_id IN (${placeholders})`,
            productIds
          )
          .then((r: any) => r[0]),
        conn
          .execute<RowDataPacket[]>(
            `SELECT vo.* FROM variant_options vo 
             INNER JOIN product_variants pv ON vo.variant_id = pv.id 
             WHERE pv.product_id IN (${placeholders})`,
            productIds
          )
          .then((r: any) => r[0]),
      ]);
    }

    // Format products with related data
    const formattedProducts = products.map((product) => ({
      id: product.id,
      productName: product.productName,
      slug: product.slug,
      description: product.description,
      category_id: product.category_id || null,
      category: product.category,
      subcategory_id: product.subcategory_id || null,
      subcategory: product.subcategory,
      productImage: product.productImage,
      price: product.price,
      sellingPrice: product.sellingPrice,
      discountPercent: product.discountPercent,
      quantity: product.quantity,
      unit: product.unit,
      stockQuantity: product.stockQuantity,
      locationAvailability: safeParseJSON(product.locationAvailability),
      product_tags: safeParseJSON(product.product_tags),
      metaTitle: product.metaTitle || null,
      metaKeywords: product.metaKeywords || null,
      metaDescription: product.metaDescription || null,
      canonicalUrl: product.canonicalUrl || null,
      created_at: product.created_at,
      updated_at: product.updated_at,

      gallery: galleryRows
        .filter((g) => g.product_id === product.id)
        .map((g) => g.image),

      variants: variantRows
        .filter((v) => v.product_id === product.id)
        .map((variant) => ({
          id: variant.id,
          name: variant.name,
          options: optionRows
            .filter((opt) => opt.variant_id === variant.id)
            .map((o) => o.optionValue),
        })),
    }));

    // Return successful response
    return NextResponse.json({
      success: true,
      pagination,
      data: formattedProducts,
      
      filters: {
        search: filters.search || null,
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
        categories: filters.categories || [],
        subcategories: filters.subcategories || [],
        tags: filters.tags || [],
        cities: filters.cities || [],
        sortBy: filters.sortBy,
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("PRODUCT SEARCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to search products",
        error: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500, headers: corsHeaders }
    );
  } finally {
    // Release connection
    if (conn) {
      try {
        await conn.release();
      } catch (releaseErr) {
        console.error("Connection release error:", releaseErr);
      }
    }
  }
}

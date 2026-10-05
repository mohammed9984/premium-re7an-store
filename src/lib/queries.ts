import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { deliveryZones, products as productsTable, reviews as reviewsTable } from "@/db/schema";
import { PRODUCTS, SEED_REVIEWS } from "@/data/catalog";
import { DEFAULT_DELIVERY_ZONES } from "@/data/delivery";
import type { DeliveryZone, Gender, Longevity, Product, Review, Sillage, SizeOption } from "./types";
import type { ProductRow, ReviewRow, DeliveryZoneRow } from "@/db/schema";

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nameArabic: row.nameArabic,
    nameEnglish: row.nameEnglish,
    taglineArabic: row.taglineArabic,
    taglineEnglish: row.taglineEnglish,
    descriptionArabic: row.descriptionArabic,
    descriptionEnglish: row.descriptionEnglish,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice === null ? null : Number(row.compareAtPrice),
    currency: row.currency,
    images: Array.isArray(row.images) ? row.images : [],
    category: row.category,
    gender: row.gender as Gender,
    fragranceFamily: row.fragranceFamily,
    topNotes: row.topNotes ?? [],
    heartNotes: row.heartNotes ?? [],
    baseNotes: row.baseNotes ?? [],
    sizes: (row.sizes ?? []) as SizeOption[],
    longevity: row.longevity as Longevity,
    sillage: row.sillage as Sillage,
    occasions: row.occasions ?? [],
    seasons: row.seasons ?? [],
    scentProfile: row.scentProfile ?? [],
    stock: row.stock,
    rating: Number(row.rating),
    reviewsCount: row.reviewsCount,
    featured: row.featured,
    bestseller: row.bestseller,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

/** Reads the live catalog from PostgreSQL, falling back to the seed file. */
export async function listProducts(): Promise<Product[]> {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.isActive, true))
      .orderBy(asc(productsTable.sortOrder));
    if (rows.length === 0) return PRODUCTS.filter((p) => p.isActive);
    return rows.map(mapProduct);
  } catch {
    return PRODUCTS.filter((p) => p.isActive);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await db.select().from(productsTable).where(eq(productsTable.slug, slug)).limit(1);
    if (rows.length > 0) return mapProduct(rows[0]);
  } catch {
    // fall through to static catalog
  }
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function listReviews(productSlug?: string): Promise<Review[]> {
  const fallback: Review[] = SEED_REVIEWS.filter(
    (r) => !productSlug || r.productSlug === productSlug || r.productSlug === null,
  ).map((r, i) => ({
    id: i + 1,
    authorName: r.authorName,
    city: r.city,
    rating: r.rating,
    bodyArabic: r.bodyArabic,
    bodyEnglish: r.bodyEnglish,
    createdAt: new Date(2025, 0, i + 2).toISOString(),
    productSlug: r.productSlug,
  }));

  try {
    const rows: ReviewRow[] = await db
      .select()
      .from(reviewsTable)
      .orderBy(desc(reviewsTable.createdAt));
    const filtered = rows.filter(
      (r) => !productSlug || r.productSlug === productSlug || r.productSlug === null,
    );
    if (filtered.length === 0) return fallback;
    return filtered.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      city: r.city,
      rating: r.rating,
      bodyArabic: r.bodyArabic,
      bodyEnglish: r.bodyEnglish,
      createdAt: r.createdAt.toISOString(),
      productSlug: r.productSlug,
    }));
  } catch {
    return fallback;
  }
}

function mapZone(row: DeliveryZoneRow): DeliveryZone {
  return {
    code: row.code,
    nameArabic: row.nameArabic,
    nameEnglish: row.nameEnglish,
    fee: Number(row.fee),
    etaArabic: row.etaArabic,
    etaEnglish: row.etaEnglish,
    freeDeliveryOver: row.freeDeliveryOver === null ? null : Number(row.freeDeliveryOver),
    isActive: row.isActive,
  };
}

/** Governorate delivery config — editable in DB/admin, with static fallback. */
export async function listDeliveryZones(): Promise<DeliveryZone[]> {
  try {
    const rows = await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.isActive, true))
      .orderBy(asc(deliveryZones.sortOrder));
    if (rows.length === 0) return DEFAULT_DELIVERY_ZONES;
    return rows.map(mapZone);
  } catch {
    return DEFAULT_DELIVERY_ZONES;
  }
}

export async function countProducts(): Promise<number> {
  try {
    const [row] = await db.select({ value: sql<number>`count(*)::int` }).from(productsTable);
    return row?.value ?? PRODUCTS.length;
  } catch {
    return PRODUCTS.length;
  }
}

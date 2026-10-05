/**
 * Seeds the RE7AN demo catalog into PostgreSQL.
 * Reuses the same data files the storefront falls back to, so there is a single
 * source of truth. Safe to re-run (upserts by slug / code).
 *
 *   node --experimental-strip-types scripts/seed.ts
 */
import { Pool } from "pg";
import { PRODUCTS, SEED_REVIEWS } from "../src/data/catalog.ts";
import { DEFAULT_DELIVERY_ZONES } from "../src/data/delivery.ts";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const pool = new Pool({ connectionString });

async function seedProducts() {
  for (const [index, product] of PRODUCTS.entries()) {
    await pool.query(
      `insert into products (
        slug, name_arabic, name_english, tagline_arabic, tagline_english,
        description_arabic, description_english, price, compare_at_price, currency, images,
        category, gender, fragrance_family, top_notes, heart_notes, base_notes, sizes,
        longevity, sillage, occasions, seasons, scent_profile, stock, rating, reviews_count,
        featured, bestseller, is_active, sort_order
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30
      )
      on conflict (slug) do update set
        name_arabic = excluded.name_arabic,
        name_english = excluded.name_english,
        tagline_arabic = excluded.tagline_arabic,
        tagline_english = excluded.tagline_english,
        description_arabic = excluded.description_arabic,
        description_english = excluded.description_english,
        price = excluded.price,
        compare_at_price = excluded.compare_at_price,
        images = excluded.images,
        category = excluded.category,
        gender = excluded.gender,
        fragrance_family = excluded.fragrance_family,
        top_notes = excluded.top_notes,
        heart_notes = excluded.heart_notes,
        base_notes = excluded.base_notes,
        sizes = excluded.sizes,
        longevity = excluded.longevity,
        sillage = excluded.sillage,
        occasions = excluded.occasions,
        seasons = excluded.seasons,
        scent_profile = excluded.scent_profile,
        stock = excluded.stock,
        rating = excluded.rating,
        reviews_count = excluded.reviews_count,
        featured = excluded.featured,
        bestseller = excluded.bestseller,
        is_active = excluded.is_active,
        sort_order = excluded.sort_order`,
      [
        product.slug,
        product.nameArabic,
        product.nameEnglish,
        product.taglineArabic,
        product.taglineEnglish,
        product.descriptionArabic,
        product.descriptionEnglish,
        product.price,
        product.compareAtPrice,
        product.currency,
        JSON.stringify(product.images),
        product.category,
        product.gender,
        product.fragranceFamily,
        JSON.stringify(product.topNotes),
        JSON.stringify(product.heartNotes),
        JSON.stringify(product.baseNotes),
        JSON.stringify(product.sizes),
        product.longevity,
        product.sillage,
        JSON.stringify(product.occasions),
        JSON.stringify(product.seasons),
        JSON.stringify(product.scentProfile),
        product.stock,
        product.rating,
        product.reviewsCount,
        product.featured,
        product.bestseller,
        product.isActive,
        product.sortOrder ?? index + 1,
      ],
    );
  }
}

async function seedZones() {
  for (const [index, zone] of DEFAULT_DELIVERY_ZONES.entries()) {
    await pool.query(
      `insert into delivery_zones (code, name_arabic, name_english, fee, eta_arabic, eta_english, free_delivery_over, is_active, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (code) do update set
         name_arabic = excluded.name_arabic,
         name_english = excluded.name_english,
         eta_arabic = excluded.eta_arabic,
         eta_english = excluded.eta_english,
         free_delivery_over = excluded.free_delivery_over,
         is_active = excluded.is_active,
         sort_order = excluded.sort_order`,
      [
        zone.code,
        zone.nameArabic,
        zone.nameEnglish,
        zone.fee,
        zone.etaArabic,
        zone.etaEnglish,
        zone.freeDeliveryOver,
        zone.isActive,
        index + 1,
      ],
    );
  }
}

async function seedReviews() {
  const { rows } = await pool.query("select count(*)::int as count from reviews");
  if ((rows[0]?.count ?? 0) > 0) return;
  for (const review of SEED_REVIEWS) {
    await pool.query(
      `insert into reviews (product_slug, author_name, city, rating, body_arabic, body_english, is_demo)
       values ($1,$2,$3,$4,$5,$6,true)`,
      [
        review.productSlug,
        review.authorName,
        review.city,
        review.rating,
        review.bodyArabic,
        review.bodyEnglish,
      ],
    );
  }
}

async function main() {
  await seedProducts();
  await seedZones();
  await seedReviews();

  const counts = await pool.query(
    "select (select count(*) from products) as products, (select count(*) from delivery_zones) as zones, (select count(*) from reviews) as reviews",
  );
  console.log("RE7AN seed complete:", counts.rows[0]);
  await pool.end();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await pool.end();
  process.exit(1);
});

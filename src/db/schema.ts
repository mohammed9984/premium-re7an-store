import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * PRODUCTS
 * Mirrors the `Product` type in src/lib/types.ts so the catalog can later be
 * managed from an admin panel or an external CMS without frontend changes.
 */
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    nameArabic: varchar("name_arabic", { length: 200 }).notNull(),
    nameEnglish: varchar("name_english", { length: 200 }).notNull(),
    taglineArabic: text("tagline_arabic").notNull().default(""),
    taglineEnglish: text("tagline_english").notNull().default(""),
    descriptionArabic: text("description_arabic").notNull().default(""),
    descriptionEnglish: text("description_english").notNull().default(""),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 8 }).notNull().default("EGP"),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    category: varchar("category", { length: 60 }).notNull(),
    gender: varchar("gender", { length: 20 }).notNull(),
    fragranceFamily: varchar("fragrance_family", { length: 60 }).notNull(),
    topNotes: jsonb("top_notes").$type<string[]>().notNull().default([]),
    heartNotes: jsonb("heart_notes").$type<string[]>().notNull().default([]),
    baseNotes: jsonb("base_notes").$type<string[]>().notNull().default([]),
    sizes: jsonb("sizes")
      .$type<{ ml: number; priceDelta: number; inStock: boolean }[]>()
      .notNull()
      .default([]),
    longevity: varchar("longevity", { length: 40 }).notNull().default("medium"),
    sillage: varchar("sillage", { length: 40 }).notNull().default("moderate"),
    occasions: jsonb("occasions").$type<string[]>().notNull().default([]),
    seasons: jsonb("seasons").$type<string[]>().notNull().default([]),
    scentProfile: jsonb("scent_profile").$type<string[]>().notNull().default([]),
    stock: integer("stock").notNull().default(0),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
    reviewsCount: integer("reviews_count").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    bestseller: boolean("bestseller").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("products_slug_idx").on(table.slug)],
);

/** Governorate level delivery configuration (editable without touching UI). */
export const deliveryZones = pgTable(
  "delivery_zones",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 40 }).notNull(),
    nameArabic: varchar("name_arabic", { length: 120 }).notNull(),
    nameEnglish: varchar("name_english", { length: 120 }).notNull(),
    fee: numeric("fee", { precision: 10, scale: 2 }).notNull(),
    etaArabic: varchar("eta_arabic", { length: 120 }).notNull().default(""),
    etaEnglish: varchar("eta_english", { length: 120 }).notNull().default(""),
    freeDeliveryOver: numeric("free_delivery_over", { precision: 10, scale: 2 }),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [uniqueIndex("delivery_zones_code_idx").on(table.code)],
);

/** Demo customer reviews. Marked as demo content in the UI. */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productSlug: varchar("product_slug", { length: 160 }),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull().default(""),
  rating: integer("rating").notNull().default(5),
  bodyArabic: text("body_arabic").notNull(),
  bodyEnglish: text("body_english").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  isDemo: boolean("is_demo").notNull().default(true),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id"),
  slug: varchar("slug", { length: 160 }).notNull(),
  nameArabic: varchar("name_arabic", { length: 200 }).notNull(),
  nameEnglish: varchar("name_english", { length: 200 }).notNull(),
  sizeMl: integer("size_ml").notNull().default(50),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

/** ORDERS */
export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 32 }).notNull(),
    customerName: varchar("customer_name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 200 }),
    governorateCode: varchar("governorate_code", { length: 40 }).notNull(),
    governorateNameArabic: varchar("governorate_name_arabic", { length: 120 })
      .notNull()
      .default(""),
    governorateNameEnglish: varchar("governorate_name_english", { length: 120 })
      .notNull()
      .default(""),
    city: varchar("city", { length: 120 }).notNull(),
    addressLine: text("address_line").notNull(),
    notes: text("notes"),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull(),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 8 }).notNull().default("EGP"),
    paymentMethod: varchar("payment_method", { length: 32 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 32 }).notNull().default("pending"),
    status: varchar("status", { length: 32 }).notNull().default("new"),
    locale: varchar("locale", { length: 8 }).notNull().default("ar"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("orders_reference_idx").on(table.reference),
    index("orders_created_at_idx").on(table.createdAt),
  ],
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 200 }).notNull(),
    locale: varchar("locale", { length: 8 }).notNull().default("ar"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("newsletter_email_idx").on(table.email)],
);

/** Key/value store for editable site copy (hero, story, benefits...). */
export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 120 }).notNull(),
    valueArabic: text("value_arabic").notNull().default(""),
    valueEnglish: text("value_english").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("content_blocks_key_idx").on(table.key)],
);

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type DeliveryZoneRow = typeof deliveryZones.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;

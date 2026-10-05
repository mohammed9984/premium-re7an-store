# RE7AN (ريحان) — Egyptian Perfume Store

A production-quality Next.js storefront for an Egyptian fragrance brand: Arabic-first (RTL)
with full English (LTR) support, EGP pricing, cash on delivery, governorate-level delivery
fees, WhatsApp ordering, and a PostgreSQL/Drizzle data layer.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (brand tokens in `src/app/globals.css`)
- PostgreSQL + Drizzle ORM (`src/db/schema.ts`)
- No payment gateway connected yet (see below)

## Getting started

```bash
npm install
npx drizzle-kit push                                            # create tables
node --experimental-strip-types scripts/seed.ts                 # seed products, zones, reviews
npm run dev
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `ADMIN_PASSCODE` | Passcode for `/admin` (default `re7an-admin`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables GA4, only after visitor consent |
| `NEXT_PUBLIC_META_PIXEL_ID` | Enables Meta Pixel, only after visitor consent |

## Where to edit things

| What | Where |
| --- | --- |
| Products / catalog | `products` table (seeded from `src/data/catalog.ts`) |
| Delivery fees + ETA per governorate | `delivery_zones` table, editable live in `/admin` |
| Site config (WhatsApp number, socials, email) | `src/lib/site.ts` |
| Arabic / English copy | `src/lib/i18n/ar.ts` and `src/lib/i18n/en.ts` |
| Policy & editorial pages | `src/data/content.ts` |
| Benefits, ingredients, finder options | dictionaries (`src/lib/i18n/*.ts`) |

Everything in the storefront reads from the database with a static fallback, so the site
never breaks if PostgreSQL is unreachable.

## Commerce flow

1. Add to cart (client state, persisted in `localStorage`) → cart drawer or `/cart`.
2. `/checkout` collects name, Egyptian mobile, email, governorate, city, address, notes.
3. `POST /api/orders` validates (Egyptian mobile regex `010/011/012/015`), recalculates the
   subtotal + governorate fee server-side, and writes `orders` + `order_items`.
4. `/order/[reference]` confirms with a `RE7-XXXXX` reference; `/admin` manages status and fees.

### Payments

Cash on delivery is the only live method. The checkout renders placeholders for
**Credit/Debit card** and **local wallet** that are clearly labelled "not enabled yet"
(`paymentMethod` is already part of the order schema). To go live, add a provider route
(e.g. Paymob / Fawry / Stripe) under `src/app/api/payments/`, mark the order
`paymentStatus: 'paid'` on webhook, and flip the disabled option in
`src/components/checkout/CheckoutView.tsx`.

## Honesty rules kept in this build

- Reviews are demo placeholder content and labelled as such.
- No certifications, awards, customer counts or "100% authentic" claims are invented.
- Longevity / sillage are presented as editable product data, not marketing guarantees.
- The demo WhatsApp number (`+20 100 000 0000`) must be replaced in `src/lib/site.ts`.

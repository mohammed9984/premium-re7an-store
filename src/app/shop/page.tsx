import type { Metadata } from "next";
import { listProducts } from "@/lib/queries";
import { ShopView, type ShopQuery } from "@/components/shop/ShopView";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return {
    title:
      locale === "ar"
        ? "عطور رجالية ونسائية وشرقية في مصر | RE7AN"
        : "Men's, women's & oriental perfumes in Egypt | RE7AN",
    description:
      locale === "ar"
        ? "تسوّق كل عطور ريحان: عطور رجالية، نسائية، شرقية وللجنسين. فلترة بالعائلة العطرية والسعر والحجم والتقييم، دفع عند الاستلام."
        : "Shop every RE7AN fragrance: men, women, oriental and unisex. Filter by family, price, size and rating. Cash on delivery in Egypt.",
    alternates: { canonical: "/shop" },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { t } = await getI18n();
  const params = await searchParams;
  const products = await listProducts();

  const single = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const query: ShopQuery = {
    category: single("category"),
    gender: single("gender"),
    family: single("family"),
    size: single("size"),
    rating: single("rating"),
    inStock: single("inStock"),
    maxPrice: single("maxPrice"),
    sort: single("sort"),
    q: single("q"),
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-forest-900/8 bg-forest-950 py-14 md:py-20">
        <div className="arabesque absolute inset-0 opacity-20" />
        <div className="shell relative">
          <nav className="mb-4 text-[0.72rem] text-ivory/50" aria-label="Breadcrumb">
            <span>RE7AN</span>
            <span className="mx-2">/</span>
            <span className="text-ivory/80">{t.nav.shop}</span>
          </nav>
          <h1 className="font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
            {t.shop.title}
          </h1>
          <p className="mt-3 max-w-xl text-[0.95rem] text-ivory/65">{t.shop.subtitle}</p>
        </div>
      </section>

      <div className="py-10 md:py-14">
        <ShopView
          key={JSON.stringify(query)}
          products={products}
          initialQuery={query}
        />
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function BestSellers({ products }: { products: Product[] }) {
  const { t, locale } = useI18n();

  return (
    <section className="bg-ivory-200/60 py-16 md:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow={locale === "ar" ? "الأكثر طلباً" : "Most wanted"}
          title={t.home.bestsellersTitle}
          subtitle={t.home.bestsellersSubtitle}
          action={
            <Link href="/shop" className="btn btn-outline mt-2">
              {t.cta.viewAll}
            </Link>
          }
        />

        {products.length === 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <Reveal className="mt-10">
            <ProductGrid products={products} />
          </Reveal>
        )}
      </div>
    </section>
  );
}

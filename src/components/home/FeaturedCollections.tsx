"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { FEATURED_COLLECTIONS } from "@/data/catalog";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const COLLECTION_HREF: Record<string, string> = {
  men: "/shop?gender=men",
  women: "/shop?gender=women",
  unisex: "/shop?gender=unisex",
  oriental: "/shop?family=oriental",
  occasions: "/shop?category=occasions",
  gifts: "/shop?category=gifts",
};

export function FeaturedCollections() {
  const { t, locale } = useI18n();

  return (
    <section className="shell py-16 md:py-24">
      <SectionHeading
        eyebrow={locale === "ar" ? "تشكيلات ريحان" : "RE7AN collections"}
        title={t.home.featuredTitle}
        subtitle={t.home.featuredSubtitle}
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {FEATURED_COLLECTIONS.map((collection, index) => (
          <Reveal key={collection.slug} delay={index * 60}>
            <Link
              href={COLLECTION_HREF[collection.slug] ?? "/shop"}
              className="group relative block h-52 overflow-hidden rounded-2xl bg-forest-900 sm:h-64"
            >
              <Image
                src={collection.image}
                alt={locale === "ar" ? collection.ar : collection.en}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-lg text-ivory sm:text-xl">
                  {locale === "ar" ? collection.ar : collection.en}
                </h3>
                <p className="mt-1 text-[0.75rem] text-ivory/65">
                  {locale === "ar" ? collection.descAr : collection.descEn}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-gold-300 opacity-0 transition-all duration-300 group-hover:opacity-100 max-lg:opacity-100">
                  {t.cta.viewAll}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

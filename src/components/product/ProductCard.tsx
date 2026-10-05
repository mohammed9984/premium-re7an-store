"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { useCart } from "@/components/providers/CartProvider";
import {
  discountPercent,
  formatPrice,
  formatRating,
  familyName,
  genderLabel,
  productName,
} from "@/lib/localize";
import { Stars } from "@/components/ui/Rating";
import { QuickView } from "./QuickView";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { t, locale } = useI18n();
  const cart = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [sizeMl, setSizeMl] = useState<number>(
    product.sizes.find((s) => s.ml === 50)?.ml ?? product.sizes[0]?.ml ?? 50,
  );

  const discount = discountPercent(product);
  const size = product.sizes.find((s) => s.ml === sizeMl) ?? product.sizes[0];
  const unitPrice = product.price + (size?.priceDelta ?? 0);
  const soldOut = product.stock <= 0 || size?.inStock === false;

  function handleAdd() {
    cart.add(
      {
        slug: product.slug,
        sizeMl,
        nameArabic: product.nameArabic,
        nameEnglish: product.nameEnglish,
        image: product.images[0] ?? "/images/hero-re7an.jpg",
        unitPrice,
        currency: product.currency,
        stock: product.stock,
      },
      1,
    );
  }

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-square w-full overflow-hidden bg-ivory-200">
        <Image
          src={product.images[0] ?? "/images/hero-re7an.jpg"}
          alt={productName(product, locale)}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {discount ? (
              <span className="rounded-full bg-forest-900/90 px-2.5 py-1 text-[0.68rem] font-semibold text-ivory backdrop-blur">
                {t.common.discount} {discount}%
              </span>
            ) : null}
            {product.bestseller ? (
              <span className="rounded-full bg-gold-400/95 px-2.5 py-1 text-[0.68rem] font-semibold text-forest-950">
                {t.shop.sortOptions.bestseller}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="pointer-events-auto rounded-full border border-forest-900/10 bg-ivory/90 px-3 py-1.5 text-[0.7rem] font-semibold text-forest-900 opacity-0 backdrop-blur transition-all duration-300 hover:bg-ivory group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
          >
            {t.cta.quickView}
          </button>
        </div>

        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-forest-950/85 px-4 py-2 text-xs font-semibold text-ivory">
              {t.product.outOfStock}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-[0.7rem] font-medium text-forest-700/70">
          <span className="uppercase tracking-[0.18em]">{familyName(product.fragranceFamily, locale)}</span>
          <span>{genderLabel(product.gender, t)}</span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg leading-snug text-forest-950">
            <a href={`/product/${product.slug}`} className="transition-colors hover:text-forest-600">
              {productName(product, locale)}
            </a>
          </h3>
          <p className="line-clamp-2 text-[0.82rem] leading-relaxed text-forest-800/65">
            {locale === "ar" ? product.taglineArabic : product.taglineEnglish}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[0.75rem] text-forest-800/70">
          <Stars value={product.rating} />
          <span>{formatRating(product.rating, locale)}</span>
          <span className="text-forest-800/40">·</span>
          <span>
            {product.reviewsCount} {t.common.reviews}
          </span>
        </div>

        {product.sizes.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s.ml}
                type="button"
                onClick={() => setSizeMl(s.ml)}
                disabled={!s.inStock}
                className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  sizeMl === s.ml
                    ? "border-forest-900 bg-forest-900 text-ivory"
                    : "border-forest-900/15 text-forest-800 hover:border-forest-600"
                }`}
              >
                {s.ml}
                {t.product.sizeMl}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-auto space-y-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-forest-950">
              {formatPrice(unitPrice, locale, product.currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-sm text-cocoa-400 line-through">
                {formatPrice(product.compareAtPrice + (size?.priceDelta ?? 0), locale, product.currency)}
              </span>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className="btn btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t.cta.addToCart}
            </button>
            <a
              href={`/product/${product.slug}`}
              aria-label={t.common.viewProduct}
              className="btn btn-outline px-3.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {quickViewOpen ? (
        <QuickView product={product} sizeMl={sizeMl} onClose={() => setQuickViewOpen(false)} />
      ) : null}
    </article>
  );
}

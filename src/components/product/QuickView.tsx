"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { useCart } from "@/components/providers/CartProvider";
import {
  familyName,
  formatPrice,
  formatRating,
  genderLabel,
  productName,
  priceForSize,
} from "@/lib/localize";
import { Stars } from "@/components/ui/Rating";

export function QuickView({
  product,
  sizeMl: initialSize,
  onClose,
}: {
  product: Product;
  sizeMl: number;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const cart = useCart();
  const [sizeMl, setSizeMl] = useState(initialSize);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const unitPrice = priceForSize(product, sizeMl);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-forest-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="animate-[fade-up_0.4s_cubic-bezier(0.22,1,0.36,1)_both] max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-ivory sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-square w-full bg-ivory-200 sm:aspect-auto sm:min-h-[26rem]">
            <Image
              src={product.images[0] ?? "/images/hero-re7an.jpg"}
              alt={productName(product, locale)}
              fill
              sizes="(max-width: 640px) 100vw, 380px"
              className="object-cover sm:rounded-s-3xl"
            />
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="eyebrow">{familyName(product.fragranceFamily, locale)}</p>
                <h3 className="font-display text-2xl text-forest-950">{productName(product, locale)}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.nav.close}
                className="rounded-full border border-forest-900/10 p-2 text-forest-800 transition-colors hover:bg-forest-900/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-forest-800/70">
              <Stars value={product.rating} />
              <span>{formatRating(product.rating, locale)}</span>
              <span>·</span>
              <span>{genderLabel(product.gender, t)}</span>
            </div>

            <p className="text-sm leading-relaxed text-forest-800/75">
              {locale === "ar" ? product.descriptionArabic : product.descriptionEnglish}
            </p>

            <div className="grid grid-cols-3 gap-2 text-[0.72rem]">
              <div className="rounded-xl bg-forest-50 p-2.5">
                <p className="font-semibold text-forest-700">{t.product.topNotes}</p>
                <p className="mt-0.5 text-forest-800/70">{product.topNotes.slice(0, 2).join("، ")}</p>
              </div>
              <div className="rounded-xl bg-forest-50 p-2.5">
                <p className="font-semibold text-forest-700">{t.product.heartNotes}</p>
                <p className="mt-0.5 text-forest-800/70">{product.heartNotes.slice(0, 2).join("، ")}</p>
              </div>
              <div className="rounded-xl bg-forest-50 p-2.5">
                <p className="font-semibold text-forest-700">{t.product.baseNotes}</p>
                <p className="mt-0.5 text-forest-800/70">{product.baseNotes.slice(0, 2).join("، ")}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s.ml}
                  type="button"
                  disabled={!s.inStock}
                  onClick={() => setSizeMl(s.ml)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
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

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 rounded-full border border-forest-900/15 px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-lg leading-none text-forest-800"
                  aria-label="-"
                >
                  −
                </button>
                <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="text-lg leading-none text-forest-800"
                  aria-label="+"
                >
                  +
                </button>
              </div>
              <p className="font-display text-2xl text-forest-950">
                {formatPrice(unitPrice * quantity, locale, product.currency)}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
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
                    quantity,
                  );
                  onClose();
                }}
                className="btn btn-primary flex-1"
              >
                {t.cta.addToCart}
              </button>
              <a href={`/product/${product.slug}`} className="btn btn-outline flex-1">
                {t.common.viewProduct}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

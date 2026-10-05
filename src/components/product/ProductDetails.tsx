"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { useCart } from "@/components/providers/CartProvider";
import {
  discountPercent,
  familyName,
  formatPrice,
  formatRating,
  genderLabel,
  occasionLabel,
  productName,
  priceForSize,
  profileLabel,
  seasonLabel,
} from "@/lib/localize";
import { Stars } from "@/components/ui/Rating";
import { whatsappUrl } from "@/lib/site";
import { ProductCard } from "./ProductCard";

export function ProductDetails({ product, related }: { product: Product; related: Product[] }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const cart = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [sizeMl, setSizeMl] = useState<number>(
    product.sizes.find((s) => s.ml === 50)?.ml ?? product.sizes[0]?.ml ?? 50,
  );
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);

  const name = productName(product, locale);
  const discount = discountPercent(product);
  const unitPrice = priceForSize(product, sizeMl);
  const soldOut = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const gallery = product.images.length > 0 ? product.images : ["/images/hero-re7an.jpg"];

  function addToCart() {
    cart.add(
      {
        slug: product.slug,
        sizeMl,
        nameArabic: product.nameArabic,
        nameEnglish: product.nameEnglish,
        image: gallery[0],
        unitPrice,
        currency: product.currency,
        stock: product.stock,
      },
      quantity,
    );
  }

  function buyNow() {
    addToCart();
    router.push("/checkout");
  }

  const whatsappMessage = `${t.whatsapp.greeting}${name} (${sizeMl}${t.product.sizeMl}) — ${formatPrice(unitPrice, locale, product.currency)}`;

  return (
    <div className="shell pb-16 pt-8 md:pt-12">
      <nav className="mb-6 text-[0.72rem] text-forest-800/55" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-forest-900">
          RE7AN
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-forest-900">
          {t.nav.shop}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-forest-900">{name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-3xl bg-ivory-200"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <Image
              src={gallery[activeImage]}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-transform duration-[1200ms] ease-out ${zoom ? "scale-110" : "scale-100"}`}
            />
            {discount ? (
              <span className="absolute start-4 top-4 rounded-full bg-forest-950/90 px-3 py-1.5 text-[0.7rem] font-semibold text-ivory">
                {t.common.discount} {discount}%
              </span>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-3 flex gap-3">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`${name} ${index + 1}`}
                  className={`relative h-20 w-20 overflow-hidden rounded-2xl border transition-all duration-300 ${
                    activeImage === index
                      ? "border-forest-900 ring-1 ring-forest-900/30"
                      : "border-forest-900/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-forest-900 px-3 py-1 text-[0.68rem] font-semibold text-ivory">
              {familyName(product.fragranceFamily, locale)}
            </span>
            <span className="rounded-full border border-forest-900/15 px-3 py-1 text-[0.68rem] text-forest-800">
              {genderLabel(product.gender, t)}
            </span>
            {lowStock ? (
              <span className="rounded-full bg-gold-100 px-3 py-1 text-[0.68rem] font-semibold text-gold-600">
                {t.product.lowStock}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-3xl leading-tight text-forest-950 sm:text-4xl">
            {name}
          </h1>
          <p className="mt-2 text-[0.95rem] text-forest-800/70">
            {locale === "ar" ? product.taglineArabic : product.taglineEnglish}
          </p>

          <div className="mt-4 flex items-center gap-2 text-[0.8rem] text-forest-800/70">
            <Stars value={product.rating} size={15} />
            <span className="font-semibold text-forest-950">{formatRating(product.rating, locale)}</span>
            <span className="text-forest-800/40">·</span>
            <span>
              {product.reviewsCount} {t.common.reviews}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl text-forest-950">
              {formatPrice(unitPrice, locale, product.currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-lg text-cocoa-400 line-through">
                {formatPrice(product.compareAtPrice, locale, product.currency)}
              </span>
            ) : null}
            {discount ? (
              <span className="rounded-full bg-forest-900/8 px-2.5 py-1 text-[0.72rem] font-semibold text-forest-800">
                {t.product.save} {formatPrice((product.compareAtPrice ?? 0) - product.price, locale)}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-[0.92rem] leading-loose text-forest-800/80">
            {locale === "ar" ? product.descriptionArabic : product.descriptionEnglish}
          </p>

          {/* Size + quantity */}
          <div className="mt-7 space-y-5">
            <div>
              <p className="mb-2.5 text-[0.78rem] font-semibold text-forest-950">
                {t.product.size} ({t.product.sizeMl})
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const price = priceForSize(product, size.ml);
                  return (
                    <button
                      key={size.ml}
                      type="button"
                      disabled={!size.inStock}
                      onClick={() => setSizeMl(size.ml)}
                      className={`rounded-2xl border px-4 py-2.5 text-start transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                        sizeMl === size.ml
                          ? "border-forest-900 bg-forest-900 text-ivory"
                          : "border-forest-900/15 bg-white text-forest-900 hover:border-forest-700"
                      }`}
                    >
                      <span className="block text-[0.85rem] font-semibold">
                        {size.ml}
                        {t.product.sizeMl}
                      </span>
                      <span
                        className={`block text-[0.7rem] ${sizeMl === size.ml ? "text-ivory/70" : "text-forest-800/60"}`}
                      >
                        {formatPrice(price, locale, product.currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 rounded-full border border-forest-900/15 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="-"
                  className="text-lg leading-none text-forest-800"
                >
                  −
                </button>
                <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="+"
                  className="text-lg leading-none text-forest-800"
                >
                  +
                </button>
              </div>
              <p className="text-[0.8rem] text-forest-800/60">
                {soldOut ? (
                  <span className="font-semibold text-cocoa-500">{t.product.outOfStock}</span>
                ) : (
                  <>
                    {t.product.inStock} · {formatPrice(unitPrice * quantity, locale, product.currency)}
                  </>
                )}
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={addToCart}
                disabled={soldOut}
                className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.cta.addToCart}
              </button>
              <button
                type="button"
                onClick={buyNow}
                disabled={soldOut}
                className="btn btn-gold w-full disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.cta.buyNow}
              </button>
              <a
                href={whatsappUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full sm:col-span-2"
                data-whatsapp-product={product.slug}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.42 1.32 4.9L2 22l5.4-1.42a9.83 9.83 0 004.64 1.18c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.47 2 12.04 2zm5.43 12.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.88-.15-.3-.02-.46.13-.61.15-.15.32-.37.47-.56.15-.19.2-.32.3-.52.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.2 3.05.15.2 2.05 3.2 5.02 4.36 2.47.97 2.97.78 3.51.73.54-.05 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
                </svg>
                {t.cta.orderWhatsapp}
              </a>
            </div>
          </div>

          {/* Egyptian ordering reassurance */}
          <ul className="mt-7 grid gap-2.5 rounded-2xl bg-ivory-200/70 p-4 sm:grid-cols-2">
            {t.home.trust.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest-900 text-ivory">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[0.78rem] leading-snug text-forest-800">
                  <span className="font-semibold text-forest-950">{item.title}</span>
                  <span className="block text-forest-800/65">{item.desc}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Pyramid */}
          <div className="mt-9 rounded-3xl border border-forest-900/10 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg text-forest-950">{t.product.pyramidTitle}</h2>
              <span className="text-[0.68rem] text-forest-800/45">{t.product.notesHint}</span>
            </div>
            <div className="space-y-3">
              <NoteRow label={t.product.topNotes} notes={product.topNotes} tone="sand" />
              <NoteRow label={t.product.heartNotes} notes={product.heartNotes} tone="gold" />
              <NoteRow label={t.product.baseNotes} notes={product.baseNotes} tone="forest" />
            </div>

            <div className="mt-6 grid gap-4 border-t border-forest-900/8 pt-5 sm:grid-cols-2">
              <Meter
                label={t.product.longevity}
                value={t.product.longevityLevels[product.longevity]}
                percent={product.longevity === "light" ? 35 : product.longevity === "medium" ? 60 : product.longevity === "strong" ? 80 : 95}
              />
              <Meter
                label={t.product.sillage}
                value={t.product.sillageLevels[product.sillage]}
                percent={product.sillage === "intimate" ? 35 : product.sillage === "moderate" ? 60 : product.sillage === "strong" ? 80 : 95}
              />
            </div>

            <div className="mt-6 grid gap-4 border-t border-forest-900/8 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-[0.72rem] font-semibold text-forest-950">{t.product.suitableFor}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.occasions.map((occasion) => (
                    <span
                      key={occasion}
                      className="rounded-full bg-ivory-200 px-2.5 py-1 text-[0.7rem] text-forest-800"
                    >
                      {occasionLabel(occasion, t)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold text-forest-950">{t.product.season}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.seasons.map((season) => (
                    <span
                      key={season}
                      className="rounded-full bg-ivory-200 px-2.5 py-1 text-[0.7rem] text-forest-800"
                    >
                      {seasonLabel(season, t)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[0.72rem] font-semibold text-forest-950">
                  {locale === "ar" ? "الشخصية العطرية" : "Scent character"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.scentProfile.map((profile) => (
                    <span
                      key={profile}
                      className="rounded-full border border-forest-900/12 px-2.5 py-1 text-[0.7rem] text-forest-800"
                    >
                      {profileLabel(profile, t)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl text-forest-950">{t.product.relatedTitle}</h2>
            <Link href="/shop" className="text-[0.8rem] font-medium text-gold-600 hover:underline">
              {t.cta.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function NoteRow({
  label,
  notes,
  tone,
}: {
  label: string;
  notes: string[];
  tone: "sand" | "gold" | "forest";
}) {
  const tones = {
    sand: "bg-sand-100 text-forest-900",
    gold: "bg-gold-100 text-forest-900",
    forest: "bg-forest-900 text-ivory",
  } as const;

  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 ${tones[tone]}`}>
      <span className="w-20 shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.12em] opacity-70">
        {label}
      </span>
      <span className="flex flex-wrap gap-x-3 gap-y-1 text-[0.85rem]">
        {notes.map((note) => (
          <span key={note}>{note}</span>
        ))}
      </span>
    </div>
  );
}

function Meter({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[0.75rem]">
        <span className="font-semibold text-forest-950">{label}</span>
        <span className="text-forest-800/70">{value}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ivory-200">
        <div className="h-full rounded-full bg-gold-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

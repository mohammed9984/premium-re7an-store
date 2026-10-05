"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/lib/i18n/client";
import { formatPrice } from "@/lib/localize";
import { whatsappUrl } from "@/lib/site";

export function CartView() {
  const cart = useCart();
  const { t, locale } = useI18n();

  if (!cart.hydrated) {
    return (
      <div className="shell space-y-4 py-12">
        {[0, 1].map((i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (cart.entries.length === 0) {
    return (
      <div className="shell py-16 md:py-24">
        <div className="card mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ivory-200 text-gold-500">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
              <path d="M9.5 8V6.5a2.5 2.5 0 015 0V8" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="font-display text-3xl text-forest-950">{t.cart.empty}</h2>
          <p className="max-w-sm text-[0.9rem] text-forest-800/65">{t.cart.emptyDesc}</p>
          <Link href="/shop" className="btn btn-primary mt-1">
            {t.cta.discover}
          </Link>
        </div>
      </div>
    );
  }

  const lines = cart.entries.map((entry) => ({
    ...entry,
    lineTotal: entry.unitPrice * entry.quantity,
  }));

  const whatsappMessage = `${t.whatsapp.cartMessage}${lines
    .map(
      (line) =>
        `• ${locale === "ar" ? line.nameArabic : line.nameEnglish} — ${line.sizeMl}${t.product.sizeMl} × ${line.quantity} = ${formatPrice(line.lineTotal, locale, line.currency)}`,
    )
    .join("\n")}\n${t.cart.subtotal}: ${formatPrice(cart.subtotal, locale)}`;

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12 md:py-14">
      <div className="space-y-4">
        {lines.map((line) => (
          <div
            key={`${line.slug}-${line.sizeMl}`}
            className="card flex gap-4 p-3 sm:p-4"
          >
            <Link
              href={`/product/${line.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ivory-200 sm:h-28 sm:w-28"
            >
              <Image
                src={line.image}
                alt={locale === "ar" ? line.nameArabic : line.nameEnglish}
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/product/${line.slug}`}
                    className="block truncate font-display text-lg text-forest-950 hover:text-forest-600"
                  >
                    {locale === "ar" ? line.nameArabic : line.nameEnglish}
                  </Link>
                  <p className="mt-1 text-[0.78rem] text-forest-800/60">
                    {t.product.size}: {line.sizeMl}
                    {t.product.sizeMl} · {formatPrice(line.unitPrice, locale, line.currency)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cart.remove(line.slug, line.sizeMl)}
                  className="shrink-0 rounded-full border border-forest-900/10 p-2 text-forest-800 transition-colors hover:border-cocoa-300 hover:text-cocoa-500"
                  aria-label={t.cart.remove}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-4 rounded-full border border-forest-900/12 px-3 py-1.5">
                  <button
                    type="button"
                    aria-label="-"
                    onClick={() => cart.setQuantity(line.slug, line.sizeMl, line.quantity - 1)}
                    className="text-base leading-none text-forest-800"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center text-sm font-semibold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="+"
                    onClick={() => cart.setQuantity(line.slug, line.sizeMl, line.quantity + 1)}
                    className="text-base leading-none text-forest-800"
                  >
                    +
                  </button>
                </div>
                <span className="font-display text-lg text-forest-950">
                  {formatPrice(line.lineTotal, locale, line.currency)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card p-5 sm:p-6">
          <h2 className="font-display text-xl text-forest-950">{t.cart.title}</h2>

          <dl className="mt-5 space-y-3 text-[0.88rem]">
            <div className="flex items-center justify-between">
              <dt className="text-forest-800/75">{t.cart.subtotal}</dt>
              <dd className="font-semibold text-forest-950">{formatPrice(cart.subtotal, locale)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-forest-800/75">{t.cart.delivery}</dt>
              <dd className="text-forest-800/70">{t.cart.freeDelivery}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-forest-900/10 pt-3">
              <dt className="font-display text-lg text-forest-950">{t.cart.total}</dt>
              <dd className="font-display text-xl text-forest-950">{formatPrice(cart.subtotal, locale)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-[0.72rem] leading-relaxed text-forest-800/55">{t.cart.deliveryNote}</p>

          <div className="mt-5 grid gap-2.5">
            <Link href="/checkout" className="btn btn-primary w-full">
              {t.cta.checkout}
            </Link>
            <a
              href={whatsappUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full"
            >
              {t.cta.orderWhatsapp}
            </a>
            <Link href="/shop" className="btn w-full text-[0.85rem] text-forest-800 underline-offset-4 hover:underline">
              {t.cta.continueShopping}
            </Link>
          </div>

          <ul className="mt-6 space-y-2 border-t border-forest-900/8 pt-4">
            {t.home.trust.map((item) => (
              <li key={item.title} className="flex items-center gap-2 text-[0.76rem] text-forest-800/70">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

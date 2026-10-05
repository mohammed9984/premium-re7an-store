"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/lib/i18n/client";
import { formatPrice } from "@/lib/localize";
import { whatsappUrl } from "@/lib/site";

export function CartDrawer() {
  const cart = useCart();
  const { t, locale } = useI18n();

  const lines = cart.entries.map((entry) => ({
    ...entry,
    lineTotal: entry.unitPrice * entry.quantity,
  }));

  const whatsappLines = lines
    .map(
      (line) =>
        `• ${locale === "ar" ? line.nameArabic : line.nameEnglish} — ${line.sizeMl}${t.product.sizeMl} × ${line.quantity} = ${formatPrice(line.lineTotal, locale, line.currency)}`,
    )
    .join("\n");

  const whatsappMessage = `${t.whatsapp.cartMessage}${whatsappLines}\n${t.cart.subtotal}: ${formatPrice(cart.subtotal, locale)}`;

  return (
    <div
      className={`fixed inset-0 z-[85] ${cart.isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!cart.isOpen}
    >
      <div
        onClick={cart.close}
        className={`absolute inset-0 bg-forest-950/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          cart.isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label={t.cart.title}
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-400 ease-out ${
          cart.isOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
          <div>
            <h2 className="font-display text-xl text-forest-950">{t.cart.title}</h2>
            <p className="text-xs text-forest-800/60">
              {cart.count} {t.cart.items}
            </p>
          </div>
          <button
            type="button"
            onClick={cart.close}
            aria-label={t.nav.close}
            className="rounded-full border border-forest-900/10 p-2 text-forest-900 transition-colors hover:bg-forest-900/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {!cart.hydrated ? (
          <div className="flex-1 space-y-3 p-5">
            {[0, 1].map((i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ivory-200 text-gold-500">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
                <path d="M9.5 8V6.5a2.5 2.5 0 015 0V8" strokeLinecap="round" />
              </svg>
            </span>
            <h3 className="font-display text-2xl text-forest-950">{t.cart.empty}</h3>
            <p className="text-sm text-forest-800/65">{t.cart.emptyDesc}</p>
            <Link href="/shop" onClick={cart.close} className="btn btn-primary mt-1">
              {t.cta.discover}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <div
                  key={`${line.slug}-${line.sizeMl}`}
                  className="flex gap-3 rounded-2xl border border-forest-900/8 bg-white/70 p-3"
                >
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={cart.close}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory-200"
                  >
                    <Image
                      src={line.image}
                      alt={locale === "ar" ? line.nameArabic : line.nameEnglish}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={cart.close}
                          className="block truncate font-display text-[0.98rem] text-forest-950 hover:text-forest-600"
                        >
                          {locale === "ar" ? line.nameArabic : line.nameEnglish}
                        </Link>
                        <p className="text-xs text-forest-800/60">
                          {line.sizeMl}
                          {t.product.sizeMl}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(line.slug, line.sizeMl)}
                        className="text-[0.7rem] font-medium text-cocoa-500 underline-offset-2 hover:underline"
                      >
                        {t.cart.remove}
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-3 rounded-full border border-forest-900/12 px-2.5 py-1">
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
                      <span className="text-sm font-semibold text-forest-950">
                        {formatPrice(line.lineTotal, locale, line.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="space-y-3 border-t border-forest-900/10 bg-ivory-200/60 px-5 py-4">
              <div className="flex items-center justify-between text-sm text-forest-800">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-forest-950">{formatPrice(cart.subtotal, locale)}</span>
              </div>
              <p className="text-[0.72rem] leading-relaxed text-forest-800/60">{t.cart.deliveryNote}</p>

              <div className="grid gap-2">
                <Link href="/checkout" onClick={cart.close} className="btn btn-primary w-full">
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
                <button type="button" onClick={cart.close} className="btn w-full text-forest-800 underline-offset-4 hover:underline">
                  {t.cta.continueShopping}
                </button>
              </div>
              <p className="text-center text-[0.7rem] text-forest-800/55">{t.cart.whatsappNote}</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

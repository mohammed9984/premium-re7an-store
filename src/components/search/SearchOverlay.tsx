"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { formatPrice, productName } from "@/lib/localize";
import type { Product } from "@/lib/types";

const SUGGESTIONS = [
  { ar: "مسك", en: "musk" },
  { ar: "عود", en: "oud" },
  { ar: "عطر رجالي", en: "men's fragrance" },
  { ar: "عطر نسائي", en: "women's fragrance" },
  { ar: "عطر شرقي", en: "oriental fragrance" },
  { ar: "ياسمين", en: "jasmine" },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { products?: Product[] };
        setResults(data.products ?? []);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-forest-950/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-[fade-up_0.35s_cubic-bezier(0.22,1,0.36,1)_both] w-full bg-ivory pb-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shell pt-5">
          <div className="flex items-center gap-3 border-b border-forest-900/10 pb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="text-forest-700"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.nav.search}
              className="w-full bg-transparent text-lg outline-none placeholder:text-forest-900/35"
              aria-label={t.nav.search}
            />
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

          {query.trim().length < 2 ? (
            <div className="pt-5">
              <p className="eyebrow mb-3">{locale === "ar" ? "بحث شائع" : "Popular searches"}</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.ar}
                    type="button"
                    onClick={() => setQuery(locale === "ar" ? item.ar : item.en)}
                    className="chip"
                  >
                    {locale === "ar" ? item.ar : item.en}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-5">
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton h-20 rounded-2xl" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-display text-xl text-forest-950">
                    {t.shop.noResults} “{query}”
                  </p>
                  <p className="mt-2 text-sm text-forest-800/60">{t.shop.tryOther}</p>
                </div>
              ) : (
                <ul className="max-h-[55vh] space-y-2 overflow-y-auto pe-1">
                  {results.map((product) => (
                    <li key={product.slug}>
                      <a
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-2xl border border-transparent p-2.5 transition-colors hover:border-forest-900/10 hover:bg-ivory-200/60"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ivory-200">
                          <Image
                            src={product.images[0] ?? "/images/hero-re7an.jpg"}
                            alt={productName(product, locale)}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-base text-forest-950">
                            {productName(product, locale)}
                          </p>
                          <p className="truncate text-xs text-forest-800/60">
                            {locale === "ar" ? product.taglineArabic : product.taglineEnglish}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-forest-900">
                          {formatPrice(product.price, locale, product.currency)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

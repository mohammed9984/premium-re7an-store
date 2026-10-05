"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { useCart } from "@/components/providers/CartProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { FEATURED_COLLECTIONS } from "@/data/catalog";
import { SITE } from "@/lib/site";

const COLLECTION_HREF: Record<string, string> = {
  men: "/shop?gender=men",
  women: "/shop?gender=women",
  unisex: "/shop?gender=unisex",
  oriental: "/shop?family=oriental",
  occasions: "/shop?category=occasions",
  gifts: "/shop?category=gifts",
};

export function Navbar() {
  const { t, locale } = useI18n();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/shop", label: t.nav.shop },
    { href: "/#story", label: t.nav.story },
    { href: "/#finder", label: t.nav.finder },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <>
      <div className="bg-forest-950 text-ivory">
        <div className="shell flex h-9 items-center justify-center gap-2 overflow-hidden text-[0.7rem] sm:text-[0.72rem]">
          <span className="text-gold-300">✦</span>
          <p className="truncate">
            {locale === "ar"
              ? "توصيل لكل محافظات مصر · الدفع عند الاستلام متاح"
              : "Delivery across Egypt · Cash on delivery available"}
          </p>
          <span className="hidden text-gold-300 sm:inline">✦</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[60] border-b transition-all duration-300 ${
          scrolled
            ? "border-forest-900/10 bg-ivory/90 backdrop-blur-xl"
            : "border-transparent bg-ivory"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-3 md:h-20">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.nav.menu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/5 lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/" className="group flex items-center gap-2.5" aria-label="RE7AN">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-gold-200 transition-transform duration-500 group-hover:rotate-[18deg]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M12 2.5c2 3 4.5 5.2 4.5 8.5a4.5 4.5 0 11-9 0c0-3.3 2.5-5.5 4.5-8.5z" />
                <path d="M12 15.5v6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="leading-none">
              <span className="block font-display text-[1.35rem] tracking-[0.22em] text-forest-950">
                RE7AN
              </span>
              <span className="block text-[0.65rem] tracking-[0.3em] text-cocoa-500">
                {t.brand.name}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[0.85rem] font-medium text-forest-800 transition-colors after:absolute after:-bottom-1.5 after:start-0 after:h-px after:w-0 after:bg-gold-500 after:transition-all after:duration-300 hover:text-forest-950 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-[0.85rem] font-medium text-forest-800 transition-colors hover:text-forest-950"
              >
                {t.nav.collections}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                </svg>
              </button>
              <div className="invisible absolute start-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 rtl:translate-x-1/2">
                <div className="card overflow-hidden p-2 shadow-[var(--shadow-lift)]">
                  {FEATURED_COLLECTIONS.map((collection) => (
                    <Link
                      key={collection.slug}
                      href={COLLECTION_HREF[collection.slug] ?? "/shop"}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-forest-800 transition-colors hover:bg-ivory-200"
                    >
                      <span className="h-9 w-9 overflow-hidden rounded-lg bg-ivory-200">
                        <img
                          src={collection.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </span>
                      {locale === "ar" ? collection.ar : collection.en}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.searchShort}
              className="flex h-10 w-10 items-center justify-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={cart.open}
              aria-label={t.nav.cart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
                <path d="M9.5 8V6.5a2.5 2.5 0 015 0V8" strokeLinecap="round" />
              </svg>
              {cart.count > 0 ? (
                <span className="absolute -end-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-400 px-1 text-[0.65rem] font-bold text-forest-950">
                  {cart.count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[75] lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-forest-950/50 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-400 ${
            menuOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
            <span className="font-display text-xl tracking-[0.2em] text-forest-950">RE7AN</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t.nav.close}
              className="rounded-full border border-forest-900/10 p-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-5">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 font-display text-lg text-forest-950 transition-colors hover:bg-ivory-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-6 mb-2">{t.nav.collections}</p>
            <div className="grid grid-cols-2 gap-2">
              {FEATURED_COLLECTIONS.map((collection) => (
                <Link
                  key={collection.slug}
                  href={COLLECTION_HREF[collection.slug] ?? "/shop"}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-forest-900/10 px-3 py-2.5 text-[0.82rem] text-forest-800"
                >
                  {locale === "ar" ? collection.ar : collection.en}
                </Link>
              ))}
            </div>

            <p className="eyebrow mt-6 mb-2">{t.footer.help}</p>
            <ul className="space-y-1 text-sm text-forest-800">
              {[
                { href: "/shipping", label: t.nav.shipping },
                { href: "/returns", label: t.nav.returns },
                { href: "/faq", label: t.nav.faq },
                { href: "/contact", label: t.nav.contact },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-forest-900/10 px-5 py-4">
            <LanguageSwitcher />
            <a
              href={`https://wa.me/${SITE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              WhatsApp · {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

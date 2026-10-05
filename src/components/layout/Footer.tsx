"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { SITE } from "@/lib/site";
import { FEATURED_COLLECTIONS } from "@/data/catalog";

const COLLECTION_HREF: Record<string, string> = {
  men: "/shop?gender=men",
  women: "/shop?gender=women",
  unisex: "/shop?gender=unisex",
  oriental: "/shop?family=oriental",
  occasions: "/shop?category=occasions",
  gifts: "/shop?category=gifts",
};

export function Footer() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      setState(response.ok ? "done" : "error");
      if (response.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  const socials = [
    { label: "Instagram", href: SITE.social.instagram },
    { label: "Facebook", href: SITE.social.facebook },
    { label: "TikTok", href: SITE.social.tiktok },
    { label: "WhatsApp", href: SITE.social.whatsapp },
  ];

  return (
    <footer className="mt-24 bg-forest-950 text-ivory">
      <div className="arabesque h-1 w-full opacity-40" />
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8 lg:py-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-forest-950">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M12 2.5c2 3 4.5 5.2 4.5 8.5a4.5 4.5 0 11-9 0c0-3.3 2.5-5.5 4.5-8.5z" />
                <path d="M12 15.5v6" strokeLinecap="round" />
              </svg>
            </span>
            <div className="leading-none">
              <p className="font-display text-2xl tracking-[0.2em]">RE7AN</p>
              <p className="mt-1 text-[0.7rem] tracking-[0.32em] text-gold-300">{t.brand.name}</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ivory/65">{t.footer.aboutBody}</p>
          <p className="text-xs text-ivory/45">{SITE.city} · {t.footer.madeIn}</p>
        </div>

        <div>
          <h3 className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-300">
            {t.footer.shop}
          </h3>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            {FEATURED_COLLECTIONS.map((collection) => (
              <li key={collection.slug}>
                <Link
                  href={COLLECTION_HREF[collection.slug] ?? "/shop"}
                  className="transition-colors hover:text-ivory"
                >
                  {locale === "ar" ? collection.ar : collection.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-300">
            {t.footer.help}
          </h3>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            {[
              { href: "/about", label: t.nav.about },
              { href: "/contact", label: t.nav.contact },
              { href: "/faq", label: t.nav.faq },
              { href: "/shipping", label: t.nav.shipping },
              { href: "/returns", label: t.nav.returns },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-300">
              {t.footer.followUs}
            </h3>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ivory/20 px-3 py-1.5 text-[0.75rem] text-ivory/80 transition-colors hover:border-gold-300 hover:text-ivory"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={subscribe} className="space-y-2">
            <label className="text-[0.78rem] text-ivory/70" htmlFor="footer-newsletter">
              {t.footer.newsletterMini}
            </label>
            <div className="flex overflow-hidden rounded-full border border-ivory/20 bg-forest-900/60">
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.home.newsletterPlaceholder}
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ivory outline-none placeholder:text-ivory/40"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="shrink-0 bg-gold-400 px-4 text-[0.78rem] font-semibold text-forest-950 transition-colors hover:bg-gold-300 disabled:opacity-60"
              >
                {state === "loading" ? "…" : t.cta.subscribe}
              </button>
            </div>
            {state === "done" ? (
              <p className="text-[0.75rem] text-gold-300">{t.home.newsletterSuccess}</p>
            ) : null}
            {state === "error" ? (
              <p className="text-[0.75rem] text-cocoa-200">{t.home.newsletterError}</p>
            ) : null}
          </form>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="shell flex flex-col gap-3 py-5 text-[0.72rem] text-ivory/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} RE7AN — {t.brand.name}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-ivory/80">
              {t.nav.privacy}
            </Link>
            <Link href="/terms" className="hover:text-ivory/80">
              {t.nav.terms}
            </Link>
            <Link href="/admin" className="hover:text-ivory/80">
              {t.nav.admin}
            </Link>
          </div>
          <p className="text-ivory/35">{t.footer.paymentNote}</p>
        </div>
      </div>
    </footer>
  );
}

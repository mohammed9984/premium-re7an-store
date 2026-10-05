"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  const { t, locale } = useI18n();

  return (
    <section className="relative isolate overflow-hidden bg-forest-950">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-re7an.jpg"
          alt={locale === "ar" ? "عطر ريحان" : "RE7AN fragrance"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-950/55 to-forest-950/95" />
        <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l ltr:from-forest-950/85 rtl:from-forest-950/85 ltr:via-forest-950/20 rtl:via-forest-950/20 ltr:to-transparent rtl:to-transparent" />
      </div>

      <div className="shell relative flex min-h-[86svh] flex-col justify-center py-20 sm:min-h-[80svh] md:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-forest-950/40 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-gold-200 backdrop-blur">
              ✦ {t.home.heroEyebrow}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.12] text-ivory sm:text-6xl lg:text-[4.25rem]">
              {t.home.heroTitle}
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-gold px-7 py-3.5 text-[0.95rem]">
                {t.cta.discover}
              </Link>
              <Link href="/shop?sort=bestseller" className="btn btn-ghost-light px-7 py-3.5 text-[0.95rem]">
                {t.cta.shopNow}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.78rem] text-ivory/65">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                {t.home.trust[0].title}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                {t.home.trust[1].title}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                {t.home.trust[2].title}
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-ivory/10 bg-forest-950/70 backdrop-blur">
        <div className="shell grid grid-cols-2 py-5 text-center sm:grid-cols-4">
          {t.home.trust.map((item) => (
            <div key={item.title} className="border-ivory/10 px-2 py-2 sm:border-s sm:first:border-s-0">
              <p className="text-[0.82rem] font-semibold text-ivory">{item.title}</p>
              <p className="mt-1 text-[0.7rem] text-ivory/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

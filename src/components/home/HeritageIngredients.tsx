"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";

export function HeritageIngredients() {
  const { t, locale } = useI18n();

  return (
    <section className="relative overflow-hidden bg-cocoa-950 py-16 md:py-24">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="space-y-8">
          <Reveal>
            <span className="eyebrow text-gold-300">{t.home.heritageSubtitle}</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl">
              {t.home.heritageTitle}
            </h2>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-loose text-ivory/70">
              {t.home.heritageBody}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {t.ingredients.map((ingredient, index) => (
              <Reveal key={ingredient.name} delay={index * 45}>
                <div className="group rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-4 transition-colors duration-300 hover:border-gold-300/35 hover:bg-ivory/[0.08]">
                  <p className="font-display text-base text-ivory">{ingredient.name}</p>
                  <p className="mt-1 text-[0.76rem] leading-relaxed text-ivory/55">{ingredient.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="relative">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-ivory/10">
            <Image
              src="/images/heritage.jpg"
              alt={
                locale === "ar"
                  ? "عود، عنبر، مسك، ورد وياسمين على طاولة خشبية"
                  : "Oud, amber, musk, rose and jasmine on a wooden table"
              }
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/70 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-ivory/10 bg-cocoa-950/70 p-4 backdrop-blur">
              <p className="text-[0.8rem] leading-relaxed text-ivory/80">
                {locale === "ar"
                  ? "«العطارة كانت أول محطة قبل أي مناسبة»"
                  : "“The attar shop was the first stop before any occasion.”"}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

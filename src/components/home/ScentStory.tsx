"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";

export function ScentStory() {
  const { t, locale } = useI18n();

  const chapters = [
    {
      titleAr: "المكوّن",
      titleEn: "The ingredient",
      bodyAr: "نبدأ من مكوّن واحد صادق: ياسمين مصري، عود، أو ورد بلدي.",
      bodyEn: "We start from one honest ingredient: Egyptian jasmine, oud or damask rose.",
    },
    {
      titleAr: "التركيبة",
      titleEn: "The composition",
      bodyAr: "نبني الهرم العطري بثلاث طبقات واضحة تتحرك مع الوقت والجو.",
      bodyEn: "We build a three-layer pyramid that moves with time and weather.",
    },
    {
      titleAr: "التجربة",
      titleEn: "The experience",
      bodyAr: "تغليف فاخر، رشة متزنة، وأثر يبقى في الذاكرة قبل المكان.",
      bodyEn: "Luxury packaging, a balanced spray, and a trail remembered before the place.",
    },
  ];

  return (
    <section id="story" className="relative overflow-hidden bg-forest-950 py-16 md:py-24">
      <div className="absolute inset-0 opacity-[0.18]">
        <Image
          src="/images/heritage.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/85 to-forest-950" />

      <div className="shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-ivory/10 sm:aspect-3/2 lg:aspect-4/5">
            <Image
              src="/images/heritage.jpg"
              alt={locale === "ar" ? "مكوّنات العطر العربي التقليدية" : "Traditional Arabic perfumery ingredients"}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 end-4 hidden rounded-2xl border border-gold-300/25 bg-forest-900/85 px-5 py-4 backdrop-blur sm:block">
            <p className="font-display text-2xl text-gold-200">٨</p>
            <p className="text-[0.7rem] text-ivory/60">
              {locale === "ar" ? "مكوّنات من التراث" : "heritage ingredients"}
            </p>
          </div>
        </Reveal>

        <div className="space-y-7">
          <Reveal>
            <span className="eyebrow text-gold-300">{t.home.storyEyebrow}</span>
            <h2 className="mt-4 font-display text-2xl leading-[1.45] text-ivory sm:text-3xl lg:text-[2.4rem] lg:leading-[1.4]">
              {t.home.storyTitle}
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-[0.95rem] leading-loose text-ivory/70">{t.home.storyBody}</p>
          </Reveal>

          <Reveal delay={180}>
            <ol className="space-y-4">
              {chapters.map((chapter, index) => (
                <li key={chapter.titleAr} className="flex gap-4 border-s border-gold-300/25 ps-4">
                  <span className="font-display text-sm text-gold-300">
                    {locale === "ar" ? ["٠١", "٠٢", "٠٣"][index] : `0${index + 1}`}
                  </span>
                  <div>
                    <p className="text-[0.9rem] font-semibold text-ivory">
                      {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-ivory/60">
                      {locale === "ar" ? chapter.bodyAr : chapter.bodyEn}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={240}>
            <Link href="/about" className="btn btn-ghost-light">
              {t.home.storyLink}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

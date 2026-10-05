"use client";

import { useI18n } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";

const ICONS = [
  // leaf / quality
  "M12 21c0-6 3-9 8-10-1 6-4 9-8 10zM12 21c0-6-3-9-8-10 1 6 4 9 8 10z",
  // heritage / motif
  "M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z",
  // clock / longevity
  "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  // gift / packaging
  "M4 9h16v11H4zM4 9l2-4h12l2 4M12 9v11",
  // truck / delivery
  "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
];

export function WhyRe7an() {
  const { t } = useI18n();

  return (
    <section className="shell py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        <Reveal>
          <span className="eyebrow">{t.brand.latin}</span>
          <h2 className="mt-3 font-display text-3xl leading-tight text-forest-950 sm:text-4xl">
            {t.home.whyTitle}
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-forest-800/70">
            {t.home.whySubtitle}
          </p>
          <div className="mt-8 hidden h-px w-24 bg-gold-400 lg:block" />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {t.why.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <div className="card h-full p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-900 text-gold-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[index % ICONS.length]} />
                  </svg>
                </span>
                <h3 className="mt-4 font-display text-lg text-forest-950">{item.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-forest-800/70">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

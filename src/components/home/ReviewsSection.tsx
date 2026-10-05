"use client";

import type { Review } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { Stars } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const { t, locale } = useI18n();

  return (
    <section className="shell py-16 md:py-24">
      <SectionHeading
        eyebrow={locale === "ar" ? "آراء" : "Reviews"}
        title={t.home.reviewsTitle}
        subtitle={t.home.reviewsSubtitle}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {reviews.slice(0, 6).map((review, index) => (
          <Reveal key={review.id} delay={index * 70}>
            <figure className="card flex h-full flex-col gap-4 p-6">
              <Stars value={review.rating} size={15} />
              <blockquote className="flex-1 text-[0.9rem] leading-relaxed text-forest-800/85">
                “{locale === "ar" ? review.bodyArabic : review.bodyEnglish}”
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-forest-900/8 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-[0.8rem] font-semibold text-gold-200">
                  {(locale === "ar" ? review.authorName : review.authorName).slice(0, 1)}
                </span>
                <span className="text-[0.82rem]">
                  <span className="block font-semibold text-forest-950">{review.authorName}</span>
                  {review.city ? (
                    <span className="block text-[0.72rem] text-forest-800/55">{review.city}</span>
                  ) : null}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-center text-[0.72rem] text-forest-800/50">{t.home.reviewsDemoNote}</p>
    </section>
  );
}

"use client";

import Link from "next/link";
import type { DeliveryZone } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { formatPrice } from "@/lib/localize";
import { Reveal } from "@/components/ui/Reveal";

export function DeliverySection({ zones }: { zones: DeliveryZone[] }) {
  const { t, locale } = useI18n();
  const visible = zones.slice(0, 9);

  return (
    <section className="bg-ivory-200/60 py-16 md:py-24">
      <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
        <Reveal>
          <span className="eyebrow">{locale === "ar" ? "التوصيل" : "Delivery"}</span>
          <h2 className="mt-3 font-display text-3xl leading-tight text-forest-950 sm:text-4xl">
            {t.home.deliveryTitle}
          </h2>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-forest-800/70">
            {t.home.deliverySubtitle}
          </p>

          <ul className="mt-7 space-y-3">
            {t.home.trust.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-900 text-ivory">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[0.88rem] text-forest-800">
                  <span className="font-semibold text-forest-950">{item.title}</span> — {item.desc}
                </span>
              </li>
            ))}
          </ul>

          <Link href="/shipping" className="btn btn-outline mt-8">
            {t.nav.shipping}
          </Link>
        </Reveal>

        <Reveal delay={110}>
          <div className="card overflow-hidden">
            <div className="border-b border-forest-900/8 bg-forest-950 px-5 py-4">
              <p className="font-display text-lg text-ivory">{t.home.deliveryTableTitle}</p>
              <p className="mt-0.5 text-[0.7rem] text-ivory/55">
                {locale === "ar"
                  ? "بيانات قابلة للتعديل من لوحة التحكم لكل محافظة"
                  : "Editable per-governorate data, managed from the admin panel"}
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-start text-[0.82rem]">
                <thead className="sticky top-0 bg-ivory-200 text-forest-800">
                  <tr>
                    <th className="px-5 py-2.5 text-start font-semibold">
                      {t.checkout.governorate}
                    </th>
                    <th className="px-3 py-2.5 text-start font-semibold">{t.cart.delivery}</th>
                    <th className="px-5 py-2.5 text-start font-semibold">{t.home.deliveryEta}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/8">
                  {visible.map((zone) => (
                    <tr key={zone.code} className="transition-colors hover:bg-ivory-200/60">
                      <td className="px-5 py-3 font-medium text-forest-950">
                        {locale === "ar" ? zone.nameArabic : zone.nameEnglish}
                      </td>
                      <td className="px-3 py-3 text-forest-800">
                        {formatPrice(zone.fee, locale)}
                        {zone.freeDeliveryOver ? (
                          <span className="mt-0.5 block text-[0.68rem] text-gold-600">
                            {t.home.deliveryFree} {formatPrice(zone.freeDeliveryOver, locale)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 text-forest-800/75">
                        {locale === "ar" ? zone.etaArabic : zone.etaEnglish}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-forest-900/8 px-5 py-3 text-[0.72rem] text-forest-800/60">
              {locale === "ar"
                ? `+ ${zones.length - visible.length} محافظة أخرى — القائمة كاملة في صفحة الشحن`
                : `+ ${zones.length - visible.length} more governorates — full list on the shipping page`}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getContentPage } from "@/data/content";
import { getI18n } from "@/lib/i18n/server";
import { listDeliveryZones } from "@/lib/queries";
import { formatPrice } from "@/lib/localize";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE, whatsappUrl } from "@/lib/site";

export async function ContentPageView({ slug }: { slug: string }) {
  const { t, locale } = await getI18n();
  const page = getContentPage(slug);

  if (!page) return null;

  const zones = slug === "shipping" ? await listDeliveryZones() : [];

  const navMap: Record<string, string> = {
    about: t.nav.about,
    contact: t.nav.contact,
    faq: t.nav.faq,
    shipping: t.nav.shipping,
    returns: t.nav.returns,
    privacy: t.nav.privacy,
    terms: t.nav.terms,
  };

  const faqJsonLd =
    slug === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.sections.map((section) => ({
            "@type": "Question",
            name: section.headingAr,
            acceptedAnswer: { "@type": "Answer", text: section.bodyAr },
          })),
        }
      : null;

  return (
    <>
      <PageHeader
        eyebrow="RE7AN"
        title={locale === "ar" ? page.titleAr : page.titleEn}
        subtitle={locale === "ar" ? page.introAr : page.introEn}
      />

      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <div className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_260px] lg:gap-16">
        <article className="space-y-8">
          {page.sections.map((section, index) => (
            <section key={section.headingAr} className="space-y-3">
              <h2 className="font-display text-xl text-forest-950 sm:text-2xl">
                <span className="me-3 font-sans text-[0.7rem] font-semibold text-gold-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {locale === "ar" ? section.headingAr : section.headingEn}
              </h2>
              <p className="text-[0.92rem] leading-loose text-forest-800/80">
                {locale === "ar" ? section.bodyAr : section.bodyEn}
              </p>
            </section>
          ))}

          {slug === "shipping" && zones.length > 0 ? (
            <section className="card overflow-hidden">
              <div className="border-b border-forest-900/8 bg-ivory-200 px-5 py-3.5">
                <h2 className="font-display text-lg text-forest-950">{t.home.deliveryTableTitle}</h2>
              </div>
              <div className="max-h-[28rem] overflow-y-auto">
                <table className="w-full text-[0.82rem]">
                  <thead className="sticky top-0 bg-ivory text-forest-800">
                    <tr>
                      <th className="px-5 py-2.5 text-start font-semibold">{t.checkout.governorate}</th>
                      <th className="px-3 py-2.5 text-start font-semibold">{t.cart.delivery}</th>
                      <th className="px-5 py-2.5 text-start font-semibold">{t.home.deliveryEta}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-900/8">
                    {zones.map((zone) => (
                      <tr key={zone.code}>
                        <td className="px-5 py-3 font-medium text-forest-950">
                          {locale === "ar" ? zone.nameArabic : zone.nameEnglish}
                        </td>
                        <td className="px-3 py-3 text-forest-800">{formatPrice(zone.fee, locale)}</td>
                        <td className="px-5 py-3 text-forest-800/75">
                          {locale === "ar" ? zone.etaArabic : zone.etaEnglish}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {slug === "contact" ? (
            <section className="card space-y-4 p-6">
              <h2 className="font-display text-lg text-forest-950">
                {locale === "ar" ? "كلمنا مباشرة" : "Reach us directly"}
              </h2>
              <a
                href={whatsappUrl(
                  locale === "ar" ? t.whatsapp.general : t.whatsapp.general,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                WhatsApp · {SITE.phoneDisplay}
              </a>
              <p className="text-[0.8rem] text-forest-800/60">
                {locale === "ar" ? SITE.workingHoursAr : SITE.workingHoursEn}
              </p>
            </section>
          ) : null}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {page.image ? (
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
              <Image
                src={page.image}
                alt={locale === "ar" ? page.titleAr : page.titleEn}
                fill
                sizes="(max-width: 1024px) 100vw, 260px"
                className="object-cover"
              />
            </div>
          ) : null}

          <nav className="card p-4">
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-forest-800/50">
              {t.footer.help}
            </p>
            <ul className="space-y-1.5 text-[0.84rem]">
              {[
                { href: "/shop", label: t.nav.shop },
                { href: "/about", label: t.nav.about },
                { href: "/shipping", label: t.nav.shipping },
                { href: "/returns", label: t.nav.returns },
                { href: "/faq", label: t.nav.faq },
                { href: "/contact", label: t.nav.contact },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-forest-800 transition-colors hover:bg-ivory-200"
                  >
                    {item.label}
                    <span className="text-forest-800/40">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
      <span className="hidden">{navMap[slug]}</span>
    </>
  );
}

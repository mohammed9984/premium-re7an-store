import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByReference } from "@/lib/orders";
import { getI18n } from "@/lib/i18n/server";
import { formatPrice } from "@/lib/localize";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تأكيد الطلب | Order confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const { t, locale } = await getI18n();
  const order = await getOrderByReference(reference);

  if (!order) {
    return (
      <div className="shell py-20 text-center">
        <h1 className="font-display text-3xl text-forest-950">{t.order.notFound}</h1>
        <Link href="/shop" className="btn btn-primary mt-6">
          {t.cta.backToShop}
        </Link>
      </div>
    );
  }

  const zoneName = locale === "ar" ? order.governorateNameArabic : order.governorateNameEnglish;

  return (
    <div className="shell py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="card overflow-hidden">
          <div className="bg-forest-950 px-6 py-8 text-center sm:px-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-forest-950">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h1 className="mt-5 font-display text-2xl text-ivory sm:text-3xl">{t.order.successTitle}</h1>
            <p className="mx-auto mt-2 max-w-md text-[0.9rem] text-ivory/70">{t.order.successBody}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-2 text-[0.8rem] text-ivory">
              {t.order.reference}: <span className="font-semibold text-gold-200" dir="ltr">{order.reference}</span>
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:p-8">
            <div>
              <h2 className="font-display text-lg text-forest-950">{t.order.orderDetails}</h2>
              <ul className="mt-4 divide-y divide-forest-900/8">
                {order.items.map((item) => (
                  <li key={`${item.slug}-${item.sizeMl}`} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9rem] text-forest-950">
                        {locale === "ar" ? item.nameArabic : item.nameEnglish}
                      </span>
                      <span className="text-[0.72rem] text-forest-800/60">
                        {item.sizeMl}
                        {t.product.sizeMl} × {item.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.85rem] font-semibold text-forest-950">
                      {formatPrice(item.unitPrice * item.quantity, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-forest-900/10 pt-4 text-[0.86rem]">
                <div className="flex justify-between">
                  <dt className="text-forest-800/70">{t.cart.subtotal}</dt>
                  <dd>{formatPrice(order.subtotal, locale)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-forest-800/70">{t.cart.delivery}</dt>
                  <dd>{order.deliveryFee === 0 ? t.cart.freeDelivery : formatPrice(order.deliveryFee, locale)}</dd>
                </div>
                <div className="flex justify-between border-t border-forest-900/10 pt-2 font-display text-lg text-forest-950">
                  <dt>{t.cart.total}</dt>
                  <dd>{formatPrice(order.total, locale)}</dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-4 border-t border-forest-900/10 pt-5 sm:grid-cols-2">
              <Detail label={t.checkout.fullName} value={order.customerName} />
              <Detail label={t.checkout.phone} value={order.phone} ltr />
              <Detail
                label={t.checkout.governorate}
                value={`${zoneName} — ${order.city}`}
              />
              <Detail label={t.checkout.address} value={order.addressLine} />
              <Detail
                label={t.order.status}
                value={t.order.statuses[order.status as keyof typeof t.order.statuses] ?? order.status}
              />
              <Detail
                label={t.checkout.payment}
                value={
                  order.paymentMethod === "cod"
                    ? t.checkout.cod
                    : `${order.paymentMethod} — ${t.checkout.notConnected}`
                }
              />
              {order.notes ? <Detail label={t.checkout.notes} value={order.notes} full /> : null}
            </div>

            <div className="flex flex-col gap-2.5 border-t border-forest-900/10 pt-5 sm:flex-row">
              <Link href="/shop" className="btn btn-primary flex-1">
                {t.cta.continueShopping}
              </Link>
              <a
                href={whatsappUrl(
                  locale === "ar"
                    ? `مرحباً RE7AN، رقم طلبي ${order.reference}.`
                    : `Hello RE7AN, my order reference is ${order.reference}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex-1"
              >
                {t.cta.orderWhatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton
        message={
          locale === "ar"
            ? `مرحباً RE7AN، رقم طلبي ${order.reference}.`
            : `Hello RE7AN, my order reference is ${order.reference}.`
        }
      />
    </div>
  );
}

function Detail({
  label,
  value,
  ltr,
  full,
}: {
  label: string;
  value: string;
  ltr?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-forest-800/50">{label}</p>
      <p className="mt-1 text-[0.86rem] text-forest-950" dir={ltr ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
}

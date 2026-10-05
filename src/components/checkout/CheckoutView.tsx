"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DeliveryZone } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/lib/i18n/client";
import { formatPrice } from "@/lib/localize";
import { whatsappUrl } from "@/lib/site";

type PaymentMethod = "cod" | "card" | "wallet";

type FormState = {
  customerName: string;
  phone: string;
  email: string;
  governorateCode: string;
  city: string;
  addressLine: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

const EGYPT_PHONE = /^(010|011|012|015)\d{8}$/;

export function CheckoutView({ zones }: { zones: DeliveryZone[] }) {
  const cart = useCart();
  const { t, locale } = useI18n();
  const [form, setForm] = useState<FormState>({
    customerName: "",
    phone: "",
    email: "",
    governorateCode: "",
    city: "",
    addressLine: "",
    notes: "",
    paymentMethod: "cod",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(false);

  const zone = useMemo(
    () => zones.find((item) => item.code === form.governorateCode) ?? null,
    [zones, form.governorateCode],
  );

  const subtotal = cart.subtotal;
  const deliveryFee = zone
    ? zone.freeDeliveryOver !== null && subtotal >= zone.freeDeliveryOver
      ? 0
      : zone.fee
    : null;
  const total = subtotal + (deliveryFee ?? 0);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 3) next.customerName = t.checkout.errors.name;
    if (!EGYPT_PHONE.test(form.phone.replace(/[\s-]/g, ""))) next.phone = t.checkout.errors.phone;
    if (!form.governorateCode) next.governorateCode = t.checkout.errors.governorate;
    if (form.city.trim().length < 2) next.city = t.checkout.errors.city;
    if (form.addressLine.trim().length < 6) next.addressLine = t.checkout.errors.address;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setServerError(false);
    if (cart.entries.length === 0) {
      setErrors({ cart: t.checkout.errors.items });
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          paymentMethod: "cod",
          lines: cart.entries.map((entry) => ({
            slug: entry.slug,
            sizeMl: entry.sizeMl,
            quantity: entry.quantity,
          })),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; reference?: string; errors?: Record<string, string> };
      if (!response.ok || !data.ok || !data.reference) {
        if (data.errors) setErrors(data.errors);
        setServerError(true);
        return;
      }
      cart.clear();
      window.location.href = `/order/${data.reference}`;
    } catch {
      setServerError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.hydrated && cart.entries.length === 0) {
    return (
      <div className="shell py-16 md:py-24">
        <div className="card mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="font-display text-3xl text-forest-950">{t.cart.empty}</h2>
          <p className="text-[0.9rem] text-forest-800/65">{t.cart.emptyDesc}</p>
          <Link href="/shop" className="btn btn-primary">
            {t.cta.discover}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="shell grid gap-8 py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12 md:py-14">
      <div className="space-y-8">
        <section className="card p-5 sm:p-7">
          <h2 className="font-display text-xl text-forest-950">{t.checkout.title}</h2>
          <p className="mt-1 text-[0.82rem] text-forest-800/60">{t.checkout.subtitle}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label={t.checkout.fullName} error={errors.customerName} required full>
              <input
                className="field"
                value={form.customerName}
                onChange={(event) => update("customerName", event.target.value)}
                autoComplete="name"
                placeholder={locale === "ar" ? "مثال: أحمد محمود علي" : "e.g. Ahmed Mahmoud Ali"}
              />
            </Field>

            <Field label={t.checkout.phone} error={errors.phone} required hint={t.checkout.phoneHint}>
              <input
                className="field"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                placeholder="01012345678"
              />
            </Field>

            <Field label={t.checkout.email} error={errors.email}>
              <input
                className="field"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                dir="ltr"
                autoComplete="email"
                placeholder="name@email.com"
              />
            </Field>

            <Field label={t.checkout.governorate} error={errors.governorateCode} required>
              <select
                className="field"
                value={form.governorateCode}
                onChange={(event) => update("governorateCode", event.target.value)}
              >
                <option value="">{t.shop.any}</option>
                {zones.map((item) => (
                  <option key={item.code} value={item.code}>
                    {locale === "ar" ? item.nameArabic : item.nameEnglish}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t.checkout.city} error={errors.city} required>
              <input
                className="field"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                autoComplete="address-level2"
                placeholder={locale === "ar" ? "مثال: مدينة نصر" : "e.g. Nasr City"}
              />
            </Field>

            <Field label={t.checkout.address} error={errors.addressLine} required hint={t.checkout.addressHint} full>
              <textarea
                className="field min-h-24"
                value={form.addressLine}
                onChange={(event) => update("addressLine", event.target.value)}
                autoComplete="street-address"
              />
            </Field>

            <Field label={t.checkout.notes} hint={t.checkout.notesHint} full>
              <textarea
                className="field min-h-20"
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="card p-5 sm:p-7">
          <h2 className="font-display text-xl text-forest-950">{t.checkout.payment}</h2>

          <div className="mt-5 space-y-3">
            <PaymentOption
              selected={form.paymentMethod === "cod"}
              onSelect={() => update("paymentMethod", "cod")}
              title={t.checkout.cod}
              desc={t.checkout.codDesc}
              enabled
            />
            <PaymentOption
              selected={form.paymentMethod === "card"}
              onSelect={() => undefined}
              title={t.checkout.card}
              desc={t.checkout.cardDesc}
              badge={t.checkout.notConnected}
              enabled={false}
            />
            <PaymentOption
              selected={form.paymentMethod === "wallet"}
              onSelect={() => undefined}
              title={t.checkout.wallet}
              desc={t.checkout.walletDesc}
              badge={t.checkout.notConnected}
              enabled={false}
            />
          </div>

          <p className="mt-4 rounded-2xl bg-ivory-200/70 p-3.5 text-[0.74rem] leading-relaxed text-forest-800/70">
            {locale === "ar"
              ? "ملاحظة تقنية: الطلب بيتسجّل في قاعدة البيانات بطريقة الدفع «كاش عند الاستلام». بنية الكود جاهزة لربط بوابة دفع مصرية (Paymob / Fawry) أو Stripe لاحقاً من غير تغيير في الواجهة — لسه مفيش بوابة مربوطة فعلياً."
              : "Technical note: orders are stored with the payment method “cash on delivery”. The code is structured so an Egyptian gateway (Paymob / Fawry) or Stripe can be plugged in later without frontend changes — no gateway is connected yet."}
          </p>

          {serverError ? (
            <p className="mt-4 rounded-2xl bg-cocoa-900/8 p-3.5 text-[0.82rem] text-cocoa-700">
              {t.checkout.errors.server}
            </p>
          ) : null}

          {errors.lines ? (
            <p className="mt-4 text-[0.82rem] text-cocoa-600">{t.checkout.errors.items}</p>
          ) : null}
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card p-5 sm:p-6">
          <h2 className="font-display text-xl text-forest-950">{t.checkout.summary}</h2>

          <ul className="mt-5 space-y-3">
            {cart.entries.map((entry) => (
              <li key={`${entry.slug}-${entry.sizeMl}`} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ivory-200">
                  <Image
                    src={entry.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.85rem] font-medium text-forest-950">
                    {locale === "ar" ? entry.nameArabic : entry.nameEnglish}
                  </p>
                  <p className="text-[0.72rem] text-forest-800/60">
                    {entry.sizeMl}
                    {t.product.sizeMl} × {entry.quantity}
                  </p>
                </div>
                <span className="shrink-0 text-[0.82rem] font-semibold text-forest-950">
                  {formatPrice(entry.unitPrice * entry.quantity, locale, entry.currency)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-forest-900/10 pt-4 text-[0.88rem]">
            <div className="flex items-center justify-between">
              <dt className="text-forest-800/75">{t.cart.subtotal}</dt>
              <dd className="font-semibold text-forest-950">{formatPrice(subtotal, locale)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-forest-800/75">{t.cart.delivery}</dt>
              <dd className="text-forest-800/80">
                {zone
                  ? deliveryFee === 0
                    ? t.cart.freeDelivery
                    : formatPrice(deliveryFee ?? 0, locale)
                  : locale === "ar"
                    ? "اختار المحافظة"
                    : "Select governorate"}
              </dd>
            </div>
            {(() => {
              const freeOver = zone?.freeDeliveryOver ?? null;
              if (freeOver === null || !zone) return null;
              const zoneName = locale === "ar" ? zone.nameArabic : zone.nameEnglish;
              return (
                <p className="rounded-xl bg-gold-100/60 px-3 py-2 text-[0.72rem] text-gold-600">
                  {locale === "ar"
                    ? `شحن مجاني للطلبات فوق ${formatPrice(freeOver, locale)} في ${zoneName}`
                    : `Free shipping over ${formatPrice(freeOver, locale)} in ${zoneName}`}
                </p>
              );
            })()}
            <div className="flex items-center justify-between border-t border-forest-900/10 pt-3">
              <dt className="font-display text-lg text-forest-950">{t.cart.total}</dt>
              <dd className="font-display text-xl text-forest-950">{formatPrice(total, locale)}</dd>
            </div>
          </dl>

          {zone ? (
            <p className="mt-3 text-[0.72rem] text-forest-800/60">
              {t.home.deliveryEta}: {locale === "ar" ? zone.etaArabic : zone.etaEnglish}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn btn-primary mt-5 w-full disabled:opacity-60">
            {submitting ? t.checkout.placing : t.checkout.placeOrder}
          </button>

          <a
            href={whatsappUrl(
              locale === "ar"
                ? "مرحباً RE7AN، حابب أطلب وأكمّل تفاصيل الطلب معاكم."
                : "Hello RE7AN, I'd like to place an order and complete the details with you.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline mt-2.5 w-full"
          >
            {t.cta.orderWhatsapp}
          </a>

          <ul className="mt-6 space-y-2 border-t border-forest-900/8 pt-4">
            {t.home.trust.map((item) => (
              <li key={item.title} className="flex items-center gap-2 text-[0.76rem] text-forest-800/70">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {item.title} — {item.desc}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  hint,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[0.78rem] font-semibold text-forest-950">
        {label}
        {required ? <span className="text-gold-600"> *</span> : null}
      </span>
      {children}
      {hint && !error ? <span className="mt-1 block text-[0.7rem] text-forest-800/50">{hint}</span> : null}
      {error ? <span className="mt-1 block text-[0.72rem] text-cocoa-600">{error}</span> : null}
    </label>
  );
}

function PaymentOption({
  selected,
  onSelect,
  title,
  desc,
  badge,
  enabled,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
  badge?: string;
  enabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!enabled}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-start transition-all duration-300 ${
        selected
          ? "border-forest-900 bg-forest-900/[0.04]"
          : "border-forest-900/12 bg-white hover:border-forest-700"
      } ${enabled ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-forest-900 bg-forest-900 text-ivory" : "border-forest-900/25"
        }`}
      >
        {selected ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[0.88rem] font-semibold text-forest-950">{title}</span>
          {badge ? (
            <span className="rounded-full bg-cocoa-900/8 px-2 py-0.5 text-[0.62rem] font-semibold text-cocoa-600">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-[0.76rem] leading-relaxed text-forest-800/65">{desc}</span>
      </span>
    </button>
  );
}

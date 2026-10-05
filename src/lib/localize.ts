import type { Dictionary } from "./i18n";
import { CATEGORIES, FRAGRANCE_FAMILIES } from "@/data/catalog";
import type { Gender, Locale, Product } from "./types";

export function pick(locale: Locale, ar: string, en: string): string {
  return locale === "ar" ? ar : en;
}

export function productName(product: Product, locale: Locale): string {
  return pick(locale, product.nameArabic, product.nameEnglish);
}

export function productTagline(product: Product, locale: Locale): string {
  return pick(locale, product.taglineArabic, product.taglineEnglish);
}

export function productDescription(product: Product, locale: Locale): string {
  return pick(locale, product.descriptionArabic, product.descriptionEnglish);
}

export function categoryName(slug: string, locale: Locale): string {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) return slug;
  return pick(locale, found.ar, found.en);
}

export function familyName(slug: string, locale: Locale): string {
  const found = FRAGRANCE_FAMILIES.find((f) => f.slug === slug);
  if (!found) return slug;
  return pick(locale, found.ar, found.en);
}

export function genderLabel(gender: Gender, t: Dictionary): string {
  if (gender === "men") return t.shop.genderMen;
  if (gender === "women") return t.shop.genderWomen;
  return t.shop.genderUnisex;
}

export function occasionLabel(value: string, t: Dictionary): string {
  const map: Record<string, string> = t.product.occasions as unknown as Record<string, string>;
  return map[value] ?? value;
}

export function seasonLabel(value: string, t: Dictionary): string {
  const map: Record<string, string> = t.product.seasons as unknown as Record<string, string>;
  const normalized =
    { صيف: "summer", شتاء: "winter", ربيع: "spring", خريف: "autumn" }[value] ?? value;
  return map[normalized] ?? value;
}

export function profileLabel(value: string, t: Dictionary): string {
  const map: Record<string, string> = t.product.profile as unknown as Record<string, string>;
  const normalized =
    { منعش: "fresh", شرقي: "oriental", خشبي: "woody", زهري: "floral", حلو: "sweet", غامض: "mysterious" }[
      value
    ] ?? value;
  return map[normalized] ?? value;
}

const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function formatPrice(value: number, locale: Locale, currency = "EGP"): string {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat("en-US").format(rounded);
  if (locale === "ar") {
    const withArabicDigits = formatted.replace(/\d/g, (d) => arabicNumerals[Number(d)]);
    return `${withArabicDigits} ج.م`;
  }
  return `${currency} ${formatted}`;
}

export function formatRating(value: number, locale: Locale): string {
  const fixed = value.toFixed(1);
  return locale === "ar" ? fixed.replace(/\d/g, (d) => arabicNumerals[Number(d)]) : fixed;
}

/** Size price: base price + size delta. */
export function priceForSize(product: Product, sizeMl: number): number {
  const size = product.sizes.find((s) => s.ml === sizeMl) ?? product.sizes[0];
  return Math.max(0, product.price + (size?.priceDelta ?? 0));
}

export function discountPercent(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}

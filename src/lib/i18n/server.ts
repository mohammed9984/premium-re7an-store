import { cookies } from "next/headers";
import { DEFAULT_LOCALE, dirFor, getDictionary, isLocale, LOCALE_COOKIE } from "./index";
import type { Dictionary } from "./index";
import type { Locale } from "@/lib/types";

/**
 * Reads the visitor locale from the cookie so server-rendered HTML (and SEO
 * metadata) matches the selected language. Arabic is the default because Egypt
 * is the primary market.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getI18n(): Promise<{ locale: Locale; t: Dictionary; dir: "rtl" | "ltr" }> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale), dir: dirFor(locale) };
}

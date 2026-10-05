import type { Dictionary } from "./ar";
import { ar } from "./ar";
import { en } from "./en";
import type { Locale } from "@/lib/types";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "re7an_locale";

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ar;
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export type { Dictionary };

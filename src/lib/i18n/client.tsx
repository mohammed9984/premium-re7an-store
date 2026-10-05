"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, getDictionary, LOCALE_COOKIE } from "./index";
import type { Dictionary } from "./index";
import type { Locale } from "@/lib/types";

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      const dir = next === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = next;
      document.documentElement.dir = dir;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.refresh();
    },
    [router],
  );

  const value = useMemo<LocaleContextValue>(() => {
    const t = getDictionary(locale);
    return { locale, dir: locale === "ar" ? "rtl" : "ltr", t, setLocale };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      dir: "rtl",
      t: getDictionary(DEFAULT_LOCALE),
      setLocale: () => {},
    };
  }
  return ctx;
}

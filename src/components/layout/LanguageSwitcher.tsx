"use client";

import { useI18n } from "@/lib/i18n/client";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale, setLocale } = useI18n();
  const base =
    tone === "light"
      ? "border-ivory/30 text-ivory/80 hover:text-ivory"
      : "border-forest-900/15 text-forest-800 hover:text-forest-950";

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full border ${base} text-[0.72rem] font-semibold`}
      role="group"
      aria-label="Language"
    >
      {(["ar", "en"] as const).map((code, index) => (
        <span key={code} className="flex items-center">
          {index === 1 ? <span className="px-1 opacity-40">|</span> : null}
          <button
            type="button"
            onClick={() => setLocale(code)}
            aria-current={locale === code}
            className={`px-2.5 py-1.5 transition-colors ${
              locale === code
                ? tone === "light"
                  ? "bg-ivory text-forest-950"
                  : "bg-forest-900 text-ivory"
                : ""
            }`}
          >
            {code === "ar" ? "العربية" : "English"}
          </button>
        </span>
      ))}
    </div>
  );
}

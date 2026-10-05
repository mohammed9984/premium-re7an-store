"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";

export function Newsletter() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!response.ok) throw new Error("failed");
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="shell py-16 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-forest-900 px-6 py-12 text-center sm:px-12 md:py-16">
          <div className="arabesque pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-xl">
            <span className="eyebrow text-gold-300">{t.brand.name}</span>
            <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl">{t.home.newsletterTitle}</h2>
            <p className="mt-3 text-[0.95rem] text-ivory/70">{t.home.newsletterSubtitle}</p>

            <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.home.newsletterPlaceholder}
                aria-label={t.home.newsletterPlaceholder}
                className="w-full rounded-full border border-ivory/20 bg-forest-950/40 px-5 py-3.5 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-gold-300"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="btn btn-gold shrink-0 disabled:opacity-60"
              >
                {state === "loading" ? "…" : t.cta.subscribe}
              </button>
            </form>

            {state === "done" ? (
              <p className="mt-3 text-[0.82rem] text-gold-200">{t.home.newsletterSuccess}</p>
            ) : null}
            {state === "error" ? (
              <p className="mt-3 text-[0.82rem] text-cocoa-200">{t.home.newsletterError}</p>
            ) : null}
            <p className="mt-4 text-[0.7rem] text-ivory/40">
              {locale === "ar"
                ? "بنبعت عروض وإصدارات جديدة بس — مفيش رسائل مزعجة."
                : "Launches and offers only — no spam."}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

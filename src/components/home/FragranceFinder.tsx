"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";

type Answers = {
  profile: string | null;
  gender: string | null;
  occasion: string | null;
};

const PROFILE_MAP: Record<string, string[]> = {
  fresh: ["منعش", "fresh"],
  oriental: ["شرقي", "oriental"],
  woody: ["خشبي", "woody"],
  floral: ["زهري", "floral"],
  sweet: ["حلو", "sweet"],
  mysterious: ["غامض", "mysterious"],
};

const GENDER_MAP: Record<string, string[]> = {
  men: ["men", "رجل"],
  women: ["women", "امرأة"],
  unisex: ["unisex", "للجنسين"],
};

const OCCASION_MAP: Record<string, string[]> = {
  daily: ["يومي", "daily"],
  work: ["عمل", "work"],
  date: ["موعد", "date"],
  occasion: ["مناسبة", "occasion"],
  evening: ["سهرة", "evening"],
};

export function FragranceFinder({ products }: { products: Product[] }) {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ profile: null, gender: null, occasion: null });

  const questions = useMemo(
    () => [
      { key: "profile" as const, label: t.finder.q1, options: t.finder.opt1 },
      { key: "gender" as const, label: t.finder.q2, options: t.finder.opt2 },
      { key: "occasion" as const, label: t.finder.q3, options: t.finder.opt3 },
    ],
    [t],
  );

  function choose(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStep((current) => Math.min(3, current + 1));
  }

  const results = useMemo(() => {
    const scored = products.map((product) => {
      let score = 0;
      const profile = answers.profile ? PROFILE_MAP[answers.profile] : null;
      if (profile && product.scentProfile.some((p) => profile.includes(p))) score += 4;
      const gender = answers.gender ? GENDER_MAP[answers.gender] : null;
      if (gender && gender.includes(product.gender)) score += 3;
      const occasion = answers.occasion ? OCCASION_MAP[answers.occasion] : null;
      if (occasion && product.occasions.some((o) => occasion.includes(o))) score += 3;
      if (product.bestseller) score += 0.5;
      return { product, score };
    });

    const matched = scored.filter((entry) => entry.score >= 3);
    const sorted = (matched.length > 0 ? matched : scored).sort((a, b) => b.score - a.score);
    return sorted.slice(0, 3).map((entry) => entry.product);
  }, [products, answers]);

  const activeQuestion = questions[step];

  return (
    <section id="finder" className="relative overflow-hidden bg-sand-100 py-16 md:py-24">
      <div className="arabesque pointer-events-none absolute inset-0 opacity-[0.25]" />
      <div className="shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.brand.latin}</span>
          <h2 className="mt-3 font-display text-3xl text-forest-950 sm:text-4xl">{t.home.finderTitle}</h2>
          <p className="mt-3 text-[0.95rem] text-forest-800/70">{t.home.finderSubtitle}</p>
        </Reveal>

        {step < 3 ? (
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <div className="card p-6 sm:p-9">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex gap-1.5">
                  {questions.map((question, index) => (
                    <span
                      key={question.key}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index <= step ? "w-8 bg-forest-900" : "w-4 bg-forest-900/15"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[0.72rem] font-medium text-forest-800/60">
                  {t.finder.step} {step + 1} {t.finder.of} 3
                </span>
              </div>

              <h3 className="font-display text-2xl text-forest-950">{activeQuestion.label}</h3>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {activeQuestion.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(activeQuestion.key, ["fresh", "oriental", "woody", "floral", "sweet", "mysterious", "men", "women", "unisex", "daily", "work", "date", "occasion", "evening"][index])}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-forest-900/12 bg-white px-4 py-4 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-700 hover:shadow-[var(--shadow-soft)]"
                  >
                    <span className="text-[0.92rem] font-medium text-forest-900">{option}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-forest-900/15 text-forest-700 transition-colors group-hover:bg-forest-900 group-hover:text-ivory">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>

              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  className="mt-6 text-[0.8rem] font-medium text-forest-800/70 underline-offset-4 hover:underline"
                >
                  {t.finder.back}
                </button>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <div className="mt-10">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="font-display text-2xl text-forest-950 sm:text-3xl">{t.finder.resultsTitle}</h3>
              <p className="mt-2 text-[0.9rem] text-forest-800/70">{t.finder.resultsBody}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {[answers.profile, answers.gender, answers.occasion].filter(Boolean).map((answer) => (
                  <span
                    key={answer}
                    className="rounded-full border border-forest-900/15 bg-white px-3 py-1 text-[0.72rem] text-forest-800"
                  >
                    {answer}
                  </span>
                ))}
              </div>
            </div>

            {results.length === 0 ? (
              <p className="mt-10 text-center text-sm text-forest-800/70">{t.finder.empty}</p>
            ) : (
              <div className="mt-8">
                <ProductGrid products={results} columns={3} />
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAnswers({ profile: null, gender: null, occasion: null });
                  setStep(0);
                }}
                className="btn btn-outline"
              >
                {t.cta.restart}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

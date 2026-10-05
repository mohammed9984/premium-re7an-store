"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CATEGORIES, FRAGRANCE_FAMILIES } from "@/data/catalog";

export type ShopQuery = {
  category?: string;
  gender?: string;
  family?: string;
  size?: string;
  rating?: string;
  inStock?: string;
  maxPrice?: string;
  sort?: string;
  q?: string;
};

const SORT_KEYS = ["bestseller", "newest", "priceAsc", "priceDesc", "rating"] as const;

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function ShopView({
  products,
  initialQuery,
}: {
  products: Product[];
  initialQuery: ShopQuery;
}) {
  const { t, locale } = useI18n();
  const [categories, setCategories] = useState<string[]>(
    initialQuery.category ? initialQuery.category.split(",") : [],
  );
  const [genders, setGenders] = useState<string[]>(initialQuery.gender ? initialQuery.gender.split(",") : []);
  const [families, setFamilies] = useState<string[]>(initialQuery.family ? initialQuery.family.split(",") : []);
  const [sizes, setSizes] = useState<string[]>(initialQuery.size ? initialQuery.size.split(",") : []);
  const [rating, setRating] = useState<number>(initialQuery.rating ? Number(initialQuery.rating) : 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialQuery.maxPrice ? Number(initialQuery.maxPrice) : 4500);
  const [inStockOnly, setInStockOnly] = useState(initialQuery.inStock === "1");
  const [sort, setSort] = useState<string>(initialQuery.sort ?? "bestseller");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((product) => {
      if (categories.length > 0 && !categories.includes(product.category)) return false;
      if (genders.length > 0 && !genders.includes(product.gender)) return false;
      if (families.length > 0 && !families.includes(product.fragranceFamily)) return false;
      if (sizes.length > 0 && !product.sizes.some((size) => sizes.includes(String(size.ml)))) return false;
      if (rating > 0 && product.rating < rating) return false;
      if (product.price > maxPrice) return false;
      if (inStockOnly && product.stock <= 0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        default:
          return Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating;
      }
    });

    return list;
  }, [products, categories, genders, families, sizes, rating, maxPrice, inStockOnly, sort]);

  function clearAll() {
    setCategories([]);
    setGenders([]);
    setFamilies([]);
    setSizes([]);
    setRating(0);
    setMaxPrice(4500);
    setInStockOnly(false);
  }

  const activeCount =
    categories.length +
    genders.length +
    families.length +
    sizes.length +
    (rating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const filterPanel = (
    <div className="space-y-7">
      <FilterGroup label={t.shop.category}>
        {CATEGORIES.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setCategories((current) => toggle(current, category.slug))}
            className={`chip ${categories.includes(category.slug) ? "chip-active" : ""}`}
          >
            {locale === "ar" ? category.ar : category.en}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label={t.shop.gender}>
        {(["men", "women", "unisex"] as const).map((gender) => (
          <button
            key={gender}
            type="button"
            onClick={() => setGenders((current) => toggle(current, gender))}
            className={`chip ${genders.includes(gender) ? "chip-active" : ""}`}
          >
            {gender === "men" ? t.shop.genderMen : gender === "women" ? t.shop.genderWomen : t.shop.genderUnisex}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label={t.shop.family}>
        {FRAGRANCE_FAMILIES.map((family) => (
          <button
            key={family.slug}
            type="button"
            onClick={() => setFamilies((current) => toggle(current, family.slug))}
            className={`chip ${families.includes(family.slug) ? "chip-active" : ""}`}
          >
            {locale === "ar" ? family.ar : family.en}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label={t.shop.size}>
        {[30, 50, 100].map((ml) => (
          <button
            key={ml}
            type="button"
            onClick={() => setSizes((current) => toggle(current, String(ml)))}
            className={`chip ${sizes.includes(String(ml)) ? "chip-active" : ""}`}
          >
            {ml}
            {t.product.sizeMl}
          </button>
        ))}
      </FilterGroup>

      <div>
        <p className="mb-3 text-[0.78rem] font-semibold text-forest-950">{t.shop.price}</p>
        <input
          type="range"
          min={1500}
          max={4500}
          step={100}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="w-full accent-forest-900"
          aria-label={t.shop.price}
        />
        <div className="mt-1 flex justify-between text-[0.72rem] text-forest-800/60">
          <span>1,500 {t.common.egp}</span>
          <span>
            {locale === "ar" ? "لغاية" : "up to"} {maxPrice.toLocaleString("en-US")} {t.common.egp}
          </span>
        </div>
      </div>

      <FilterGroup label={t.shop.rating}>
        {[4.5, 4, 0].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`chip ${rating === value ? "chip-active" : ""}`}
          >
            {value === 0 ? t.shop.any : `${value}+ ★`}
          </button>
        ))}
      </FilterGroup>

      <div>
        <p className="mb-3 text-[0.78rem] font-semibold text-forest-950">{t.shop.availability}</p>
        <label className="flex cursor-pointer items-center gap-2.5 text-[0.82rem] text-forest-800">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="h-4 w-4 accent-forest-900"
          />
          {t.shop.inStockOnly}
        </label>
      </div>

      {activeCount > 0 ? (
        <button type="button" onClick={clearAll} className="text-[0.8rem] font-medium text-gold-600 underline-offset-4 hover:underline">
          {t.shop.clearFilters}
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="shell grid gap-8 pb-20 lg:grid-cols-[260px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg text-forest-950">{t.shop.filters}</h2>
            {activeCount > 0 ? (
              <span className="rounded-full bg-forest-900 px-2 py-0.5 text-[0.65rem] font-semibold text-ivory">
                {activeCount}
              </span>
            ) : null}
          </div>
          {filterPanel}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.82rem] text-forest-800/70">
            <span className="font-semibold text-forest-950">{filtered.length}</span> {t.shop.results}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="btn btn-outline px-4 py-2.5 text-[0.8rem] lg:hidden"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              {t.shop.filters}
              {activeCount > 0 ? ` (${activeCount})` : ""}
            </button>

            <label className="relative inline-flex items-center">
              <span className="sr-only">{t.shop.sort}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="appearance-none rounded-full border border-forest-900/15 bg-white py-2.5 pe-9 ps-4 text-[0.8rem] font-medium text-forest-900 outline-none"
              >
                {SORT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t.shop.sortOptions[key]}
                  </option>
                ))}
              </select>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute end-3.5 text-forest-700"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" />
              </svg>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory-200 text-gold-500">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
            </span>
            <h3 className="font-display text-2xl text-forest-950">{t.shop.empty}</h3>
            <p className="max-w-sm text-[0.85rem] text-forest-800/65">{t.shop.tryOther}</p>
            <button type="button" onClick={clearAll} className="btn btn-primary mt-1">
              {t.shop.clearFilters}
            </button>
          </div>
        ) : (
          <ProductGrid products={filtered} columns={3} />
        )}
      </div>

      {/* Mobile filter sheet */}
      <div className={`fixed inset-0 z-[80] lg:hidden ${filtersOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-forest-950/50 transition-opacity duration-300 ${
            filtersOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-ivory p-6 transition-transform duration-400 ${
            filtersOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl text-forest-950">{t.shop.filters}</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label={t.nav.close}
              className="rounded-full border border-forest-900/10 p-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {filterPanel}
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary mt-7 w-full">
            {t.shop.results}: {filtered.length}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[0.78rem] font-semibold text-forest-950">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

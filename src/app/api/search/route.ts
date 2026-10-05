import { NextResponse } from "next/server";
import { listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Lightweight product search across Arabic + English names, notes and copy. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (term.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await listProducts();
  const normalize = (value: string) => value.toLowerCase().replace(/[أإآ]/g, "ا");

  const scored = products
    .map((product) => {
      const haystack = normalize(
        [
          product.nameArabic,
          product.nameEnglish,
          product.taglineArabic,
          product.taglineEnglish,
          product.descriptionArabic,
          product.descriptionEnglish,
          product.fragranceFamily,
          product.category,
          product.gender,
          ...product.topNotes,
          ...product.heartNotes,
          ...product.baseNotes,
          ...product.scentProfile,
        ]
          .join(" ")
          .toLowerCase(),
      );
      const needle = normalize(term);
      let score = 0;
      if (haystack.includes(needle)) score += 5;
      const words = needle.split(/\s+/).filter(Boolean);
      words.forEach((word) => {
        if (haystack.includes(word)) score += 1;
      });
      if (normalize(product.nameEnglish).startsWith(needle)) score += 3;
      if (normalize(product.nameArabic).startsWith(needle)) score += 3;
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return NextResponse.json({ products: scored.map((entry) => entry.product) });
}

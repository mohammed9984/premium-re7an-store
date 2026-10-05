"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
}) {
  const cols =
    columns === 4
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 md:grid-cols-3";

  return (
    <div className={`grid gap-4 sm:gap-6 ${cols}`}>
      {products.map((product, index) => (
        <ProductCard key={`${product.slug}-${product.id}`} product={product} priority={index < 2} />
      ))}
    </div>
  );
}

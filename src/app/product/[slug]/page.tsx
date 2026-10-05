import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, listProducts, listReviews } from "@/lib/queries";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { getI18n } from "@/lib/i18n/server";
import { SITE } from "@/lib/site";
import { familyName, genderLabel, productName } from "@/lib/localize";
import type { Locale, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: locale === "ar" ? "عطر غير موجود" : "Fragrance not found" };
  }

  const name = productName(product, locale);
  const description =
    locale === "ar"
      ? `${product.taglineArabic} — ${name} من ريحان. ${product.topNotes.join("، ")}. سعر بالجنيه المصري، دفع عند الاستلام وتوصيل لكل محافظات مصر.`
      : `${product.taglineEnglish} — ${name} by RE7AN. Top notes: ${product.topNotes.join(", ")}. Price in EGP, cash on delivery across Egypt.`;

  return {
    title: `${name} | ${locale === "ar" ? "عطور مصرية فاخرة" : "Luxury Egyptian perfume"}`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${name} | RE7AN`,
      description,
      images: [{ url: product.images[0] ?? "/images/hero-re7an.jpg" }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), listProducts()]);

  if (!product || !product.isActive) notFound();

  const reviews = await listReviews(product.slug);
  const related = allProducts
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => {
      const scoreOf = (item: Product) =>
        (item.gender === product.gender ? 2 : 0) +
        (item.fragranceFamily === product.fragranceFamily ? 2 : 0) +
        (item.category === product.category ? 1 : 0);
      return scoreOf(b) - scoreOf(a);
    })
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName(product, "en"),
    alternateName: productName(product, "ar"),
    image: product.images.map((image) => `${SITE.domain}${image}`),
    description: product.descriptionEnglish,
    sku: product.slug,
    brand: { "@type": "Brand", name: "RE7AN" },
    category: `${familyName(product.fragranceFamily, "en")} / ${genderLabel(product.gender, t)}`,
    offers: {
      "@type": "Offer",
      url: `${SITE.domain}/product/${product.slug}`,
      priceCurrency: "EGP",
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      product.reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} related={related} />
      {reviews.length > 0 ? <ReviewsSection reviews={reviews} /> : null}
      <span className="hidden">{locale}</span>
    </>
  );
}

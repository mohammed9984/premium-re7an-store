import { listDeliveryZones, listProducts, listReviews } from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { BestSellers } from "@/components/home/BestSellers";
import { ScentStory } from "@/components/home/ScentStory";
import { WhyRe7an } from "@/components/home/WhyRe7an";
import { FragranceFinder } from "@/components/home/FragranceFinder";
import { HeritageIngredients } from "@/components/home/HeritageIngredients";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { DeliverySection } from "@/components/home/DeliverySection";
import { Newsletter } from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, reviews, zones] = await Promise.all([
    listProducts(),
    listReviews(),
    listDeliveryZones(),
  ]);

  const bestsellers = products.filter((product) => product.bestseller).slice(0, 4);
  const bestsellerList = bestsellers.length > 0 ? bestsellers : products.slice(0, 4);

  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers products={bestsellerList} />
      <ScentStory />
      <WhyRe7an />
      <FragranceFinder products={products} />
      <HeritageIngredients />
      <ReviewsSection reviews={reviews} />
      <DeliverySection zones={zones} />
      <Newsletter />
    </>
  );
}

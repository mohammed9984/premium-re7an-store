export type Locale = "ar" | "en";

export type Gender = "men" | "women" | "unisex";

export type SizeOption = {
  ml: number;
  priceDelta: number;
  inStock: boolean;
};

export type Product = {
  id: number;
  slug: string;
  nameArabic: string;
  nameEnglish: string;
  taglineArabic: string;
  taglineEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  images: string[];
  category: string;
  gender: Gender;
  fragranceFamily: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sizes: SizeOption[];
  longevity: Longevity;
  sillage: Sillage;
  occasions: string[];
  seasons: string[];
  scentProfile: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  bestseller: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type Longevity = "light" | "medium" | "strong" | "intense";
export type Sillage = "intimate" | "moderate" | "strong" | "enormous";

export type DeliveryZone = {
  code: string;
  nameArabic: string;
  nameEnglish: string;
  fee: number;
  etaArabic: string;
  etaEnglish: string;
  freeDeliveryOver: number | null;
  isActive: boolean;
};

export type CartLine = {
  slug: string;
  sizeMl: number;
  quantity: number;
};

export type Review = {
  id: number;
  authorName: string;
  city: string;
  rating: number;
  bodyArabic: string;
  bodyEnglish: string;
  createdAt: string;
  productSlug: string | null;
};

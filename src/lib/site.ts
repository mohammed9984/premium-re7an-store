/** Central place for business config (edit here, or move to a CMS later). */
export const SITE = {
  nameAr: "ريحان",
  nameEn: "RE7AN",
  domain: "https://re7an.example",
  whatsappNumber: "201000000000", // international format, no plus, no spaces (demo number)
  supportEmail: "hello@re7an.example",
  phoneDisplay: "+20 100 000 0000",
  city: "Cairo, Egypt",
  social: {
    instagram: "https://instagram.com/re7an",
    facebook: "https://facebook.com/re7an",
    tiktok: "https://tiktok.com/@re7an",
    whatsapp: "https://wa.me/201000000000",
  },
  workingHoursAr: "من ١٠ صباحاً حتى ١٠ مساءً — طوال أيام الأسبوع",
  workingHoursEn: "10:00 – 22:00, seven days a week",
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

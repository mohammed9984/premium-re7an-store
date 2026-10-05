import type { DeliveryZone } from "@/lib/types";

/**
 * Egyptian delivery configuration.
 * Defaults live here so the storefront works before the database is seeded;
 * once seeded, `src/lib/delivery.ts` reads live values from PostgreSQL
 * (editable from the admin area) and only falls back to this list on error.
 * Fees are intentionally configurable data — never hardcode them in the UI.
 */
export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { code: "cairo", nameArabic: "القاهرة", nameEnglish: "Cairo", fee: 55, etaArabic: "١-٢ يوم عمل", etaEnglish: "1-2 working days", freeDeliveryOver: 2500, isActive: true },
  { code: "giza", nameArabic: "الجيزة", nameEnglish: "Giza", fee: 55, etaArabic: "١-٢ يوم عمل", etaEnglish: "1-2 working days", freeDeliveryOver: 2500, isActive: true },
  { code: "qalyubia", nameArabic: "القليوبية", nameEnglish: "Qalyubia", fee: 65, etaArabic: "٢-٣ أيام عمل", etaEnglish: "2-3 working days", freeDeliveryOver: 2500, isActive: true },
  { code: "alexandria", nameArabic: "الإسكندرية", nameEnglish: "Alexandria", fee: 70, etaArabic: "٢-٣ أيام عمل", etaEnglish: "2-3 working days", freeDeliveryOver: 3000, isActive: true },
  { code: "beheira", nameArabic: "البحيرة", nameEnglish: "Beheira", fee: 75, etaArabic: "٢-٤ أيام عمل", etaEnglish: "2-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "gharbia", nameArabic: "الغربية", nameEnglish: "Gharbia", fee: 70, etaArabic: "٢-٣ أيام عمل", etaEnglish: "2-3 working days", freeDeliveryOver: 3000, isActive: true },
  { code: "kafr-el-sheikh", nameArabic: "كفر الشيخ", nameEnglish: "Kafr El Sheikh", fee: 75, etaArabic: "٢-٤ أيام عمل", etaEnglish: "2-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "dakahlia", nameArabic: "الدقهلية", nameEnglish: "Dakahlia", fee: 70, etaArabic: "٢-٣ أيام عمل", etaEnglish: "2-3 working days", freeDeliveryOver: 3000, isActive: true },
  { code: "damietta", nameArabic: "دمياط", nameEnglish: "Damietta", fee: 75, etaArabic: "٣-٤ أيام عمل", etaEnglish: "3-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "sharqia", nameArabic: "الشرقية", nameEnglish: "Sharqia", fee: 70, etaArabic: "٢-٣ أيام عمل", etaEnglish: "2-3 working days", freeDeliveryOver: 3000, isActive: true },
  { code: "monufia", nameArabic: "المنوفية", nameEnglish: "Monufia", fee: 70, etaArabic: "٢-٣ أيام عمل", etaEnglish: "2-3 working days", freeDeliveryOver: 3000, isActive: true },
  { code: "ismailia", nameArabic: "الإسماعيلية", nameEnglish: "Ismailia", fee: 80, etaArabic: "٣-٤ أيام عمل", etaEnglish: "3-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "port-said", nameArabic: "بورسعيد", nameEnglish: "Port Said", fee: 80, etaArabic: "٣-٤ أيام عمل", etaEnglish: "3-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "suez", nameArabic: "السويس", nameEnglish: "Suez", fee: 80, etaArabic: "٣-٤ أيام عمل", etaEnglish: "3-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "fayoum", nameArabic: "الفيوم", nameEnglish: "Fayoum", fee: 80, etaArabic: "٣-٤ أيام عمل", etaEnglish: "3-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "beni-suef", nameArabic: "بني سويف", nameEnglish: "Beni Suef", fee: 85, etaArabic: "٣-٤ أيام عمل", etaEnglish: "3-4 working days", freeDeliveryOver: null, isActive: true },
  { code: "minya", nameArabic: "المنيا", nameEnglish: "Minya", fee: 90, etaArabic: "٣-٥ أيام عمل", etaEnglish: "3-5 working days", freeDeliveryOver: null, isActive: true },
  { code: "asyut", nameArabic: "أسيوط", nameEnglish: "Asyut", fee: 90, etaArabic: "٣-٥ أيام عمل", etaEnglish: "3-5 working days", freeDeliveryOver: null, isActive: true },
  { code: "sohag", nameArabic: "سوهاج", nameEnglish: "Sohag", fee: 95, etaArabic: "٤-٥ أيام عمل", etaEnglish: "4-5 working days", freeDeliveryOver: null, isActive: true },
  { code: "qena", nameArabic: "قنا", nameEnglish: "Qena", fee: 95, etaArabic: "٤-٥ أيام عمل", etaEnglish: "4-5 working days", freeDeliveryOver: null, isActive: true },
  { code: "luxor", nameArabic: "الأقصر", nameEnglish: "Luxor", fee: 100, etaArabic: "٤-٥ أيام عمل", etaEnglish: "4-5 working days", freeDeliveryOver: null, isActive: true },
  { code: "aswan", nameArabic: "أسوان", nameEnglish: "Aswan", fee: 105, etaArabic: "٤-٦ أيام عمل", etaEnglish: "4-6 working days", freeDeliveryOver: null, isActive: true },
  { code: "red-sea", nameArabic: "البحر الأحمر", nameEnglish: "Red Sea", fee: 110, etaArabic: "٤-٦ أيام عمل", etaEnglish: "4-6 working days", freeDeliveryOver: null, isActive: true },
  { code: "new-valley", nameArabic: "الوادي الجديد", nameEnglish: "New Valley", fee: 115, etaArabic: "٥-٧ أيام عمل", etaEnglish: "5-7 working days", freeDeliveryOver: null, isActive: true },
  { code: "matrouh", nameArabic: "مطروح", nameEnglish: "Matrouh", fee: 110, etaArabic: "٤-٦ أيام عمل", etaEnglish: "4-6 working days", freeDeliveryOver: null, isActive: true },
  { code: "north-sinai", nameArabic: "شمال سيناء", nameEnglish: "North Sinai", fee: 115, etaArabic: "٥-٧ أيام عمل", etaEnglish: "5-7 working days", freeDeliveryOver: null, isActive: true },
  { code: "south-sinai", nameArabic: "جنوب سيناء", nameEnglish: "South Sinai", fee: 115, etaArabic: "٥-٧ أيام عمل", etaEnglish: "5-7 working days", freeDeliveryOver: null, isActive: true },
];

export const FREE_DELIVERY_THRESHOLD = 2500;

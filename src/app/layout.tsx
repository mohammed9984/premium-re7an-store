import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getLocale } from "@/lib/i18n/server";
import { dirFor } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/client";
import { CartProvider } from "@/components/providers/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Analytics } from "@/components/layout/Analytics";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "RE7AN | عطور مصرية فاخرة — RE7AN Luxury Egyptian Perfumes",
    template: "%s | RE7AN",
  },
  description:
    "ريحان (RE7AN) عطور مصرية فاخرة مستوحاة من روح مصر — عود، مسك، عنبر، ياسمين مصري وورد بلدي. دفع عند الاستلام وتوصيل لكل محافظات مصر.",
  keywords: [
    "عطور مصرية",
    "عطور رجالية في مصر",
    "عطور نسائية في مصر",
    "عطور شرقية فاخرة",
    "عطر عود",
    "مسك",
    "RE7AN",
    "ريحان",
    "Egyptian perfume",
    "perfume Egypt",
  ],
  applicationName: "RE7AN",
  authors: [{ name: "RE7AN" }],
  alternates: {
    canonical: "/",
    languages: { ar: "/", en: "/" },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    siteName: "RE7AN — ريحان",
    title: "RE7AN | عطر يحكي حكاية مصر",
    description:
      "روائح مستوحاة من روح مصر، صُممت لتترك أثراً لا يُنسى. عطور مصرية فاخرة بالدفع عند الاستلام.",
    images: [{ url: "/images/hero-re7an.jpg", width: 1200, height: 630, alt: "RE7AN perfume" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RE7AN | عطر يحكي حكاية مصر",
    description: "عطور مصرية فاخرة مستوحاة من روح مصر.",
    images: ["/images/hero-re7an.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#12211c",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RE7AN",
  alternateName: "ريحان",
  url: SITE.domain,
  logo: `${SITE.domain}/images/hero-re7an.jpg`,
  description:
    "RE7AN is an Egyptian fragrance house — عطور مصرية فاخرة مستوحاة من روح مصر.",
  areaServed: "EG",
  currenciesAccepted: "EGP",
  paymentAccepted: "Cash on delivery",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: `+${SITE.whatsappNumber}`,
    availableLanguage: ["ar", "en"],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dir = dirFor(locale);

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <LocaleProvider initialLocale={locale}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-ivory"
            >
              {locale === "ar" ? "تخطى إلى المحتوى" : "Skip to content"}
            </a>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
            <Analytics />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

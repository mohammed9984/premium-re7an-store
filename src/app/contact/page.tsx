import type { Metadata } from "next";
import { CONTENT_PAGES } from "@/data/content";
import { ContentPageView } from "@/components/pages/ContentPageView";

const page = CONTENT_PAGES["contact"];

export const metadata: Metadata = {
  title: page.titleAr + " | " + page.titleEn,
  description: page.introAr,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContentPageView slug="contact" />;
}

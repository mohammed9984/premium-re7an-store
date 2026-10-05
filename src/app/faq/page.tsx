import type { Metadata } from "next";
import { CONTENT_PAGES } from "@/data/content";
import { ContentPageView } from "@/components/pages/ContentPageView";

const page = CONTENT_PAGES["faq"];

export const metadata: Metadata = {
  title: page.titleAr + " | " + page.titleEn,
  description: page.introAr,
  alternates: { canonical: "/faq" },
};

export default function Page() {
  return <ContentPageView slug="faq" />;
}

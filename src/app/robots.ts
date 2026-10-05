import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/checkout", "/cart", "/order/", "/api/"],
      },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}

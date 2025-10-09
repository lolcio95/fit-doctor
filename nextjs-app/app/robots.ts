import type { MetadataRoute } from "next";
import { getAppDomain } from "./utils/misc";

export default function robots(): MetadataRoute.Robots {
  const domain = getAppDomain();

  return {
    rules: [
      ...(process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? [
            {
              userAgent: "*",
              allow: "/",
            },
          ]
        : [
            {
              userAgent: "*",
              disallow: "/",
            },
          ]),
      {
        userAgent: "*",
        crawlDelay: 10,
      },
      {
        userAgent: "*",
        disallow: ["/privacy-policy", "/imprint", "/studio"],
      },
    ],
    host: domain,
    sitemap: `${domain}/sitemap.xml`,
  };
}

export const dynamic = "force-dynamic";

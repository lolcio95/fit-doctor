import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";
import { getAppDomain } from "./utils/misc";

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostsAndPages = await sanityFetch({
    query: sitemapData,
  });

  const sitemap: MetadataRoute.Sitemap = [];
  const domain = getAppDomain();

  sitemap.push({
    url: domain,
    lastModified: new Date(),
  });

  if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
    for (const p of allPostsAndPages.data) {
      switch (p._type) {
        case "page":
          if (!p.slug || p.slug === "/") {
            break;
          }

          sitemap.push({
            lastModified: p._updatedAt || new Date(),
            url: `${domain}/${p.slug?.replace(/^\//, "")}`,
          });

          break;
        case "article":
          if (!p.slug) {
            break;
          }

          sitemap.push({
            lastModified: p._updatedAt || new Date(),
            url: `${domain}/${p.slug?.replace(/^\//, "")}`,
          });

          break;
        default:
          break;
      }
    }
  }

  return sitemap;
}

export const dynamic = "force-dynamic";

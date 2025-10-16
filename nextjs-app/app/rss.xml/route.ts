import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";
import { getAllArticlesQuery } from "@/sanity/lib/queries";
import { getAppDomain } from "../utils/misc";

/**
 * GET /rss.xml
 * Generate RSS feed for blog articles
 */
export async function GET() {
  try {
    const domain = getAppDomain();
    const { data: articles } = await sanityFetch({
      query: getAllArticlesQuery,
      params: { pageStart: 0, pageEnd: 50 }, // Get latest 50 articles for RSS
    });

    const rssItems = articles
      ?.map((article) => {
        if (!article.slug?.current) return null;

        const articleUrl = `${domain}${article.slug.current}`;
        const pubDate = article.date
          ? new Date(article.date).toUTCString()
          : new Date().toUTCString();

        return `
    <item>
      <title><![CDATA[${article.title || "Untitled"}]]></title>
      <link>${articleUrl}</link>
      <guid>${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${
        article.seo?.metaDescription || article.title || ""
      }]]></description>
      ${
        article.category?.categoryName
          ? `<category>${article.category.categoryName}</category>`
          : ""
      }
      ${
        article.author?.name
          ? `<dc:creator><![CDATA[${article.author.name}]]></dc:creator>`
          : ""
      }
    </item>`;
      })
      .filter(Boolean)
      .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fitdoctor.pl Blog</title>
    <link>${domain}</link>
    <description>Najnowsze artykuły o zdrowiu, diecie, treningu i suplementacji od ekspertów Fitdoctor.pl</description>
    <language>pl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}

export const dynamic = "force-dynamic";

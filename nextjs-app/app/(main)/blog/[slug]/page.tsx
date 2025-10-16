import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { articleQuery, articlePagesSlugs } from "@/sanity/lib/queries";
import { ListOfArticles } from "@/app/components/organisms/ListOfArticles";
import { ArticleContent } from "./components/ArticleContent";
import { fetchMetadata } from "@/app/utils/fetchMetadata";
import { getAppDomain } from "@/app/utils/misc";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: articlePagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });

  return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = `/blog/${params.slug}`;
  const metadata = await fetchMetadata({ query: articleQuery, slug });

  return metadata;
}

export default async function ArticlePage(props: Props) {
  const params = await props.params;
  const slug = `/blog/${params.slug}`;

  const { data: article } = await sanityFetch({
    query: articleQuery,
    params: { slug },
  });

  if (!article?._id) {
    return notFound();
  }

  const {
    listOfArticles,
    cta,
    newsletter,
    withListOfArticles,
    withCta,
    withNewsletter,
  } = article;

  // Generate JSON-LD structured data for the article
  const domain = getAppDomain();
  const articleUrl = `${domain}${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title || "",
    datePublished: article.date || new Date().toISOString(),
    dateModified: article._updatedAt || article.date || new Date().toISOString(),
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name || "",
          ...(article.author.picture?.image?.asset?.url && {
            image: article.author.picture.image.asset.url,
          }),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Fitdoctor.pl",
      logo: {
        "@type": "ImageObject",
        url: `${domain}/favicon.svg`,
      },
    },
    description:
      article.seo?.metaDescription || article.title || "",
    ...(article.coverImage?.mobileImage?.asset?.url && {
      image: article.coverImage.mobileImage.asset.url,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(article.category?.categoryName && {
      articleSection: article.category.categoryName,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        className="bg-background-secondary pt-16 md:pt-24"
        aria-labelledby="article-title"
      >
        <div className="container pb-10">
          <ArticleContent article={article} />
        </div>
        {listOfArticles && <ListOfArticles block={listOfArticles} />}
      </section>
    </>
  );
}

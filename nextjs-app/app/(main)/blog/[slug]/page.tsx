import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { articleQuery, articlePagesSlugs } from "@/sanity/lib/queries";
import { ListOfArticles } from "@/app/components/organisms/ListOfArticles";
import { ArticleContent } from "./components/ArticleContent";
import { fetchMetadata } from "@/app/utils/fetchMetadata";

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

  return (
    <section
      className="bg-background-secondary pt-16 md:pt-24"
      aria-labelledby="article-title"
    >
      <div className="container pb-10">
        <ArticleContent article={article} />
      </div>
      {listOfArticles && <ListOfArticles block={listOfArticles} />}
    </section>
  );
}

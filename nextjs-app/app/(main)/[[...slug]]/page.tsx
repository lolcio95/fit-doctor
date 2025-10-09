import type { Metadata } from "next";
import Head from "next/head";
import { notFound } from "next/navigation";

import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs } from "@/sanity/lib/queries";
import { transformStaticParams } from "@/app/utils/transformStaticParams";
import { fetchMetadata } from "@/app/utils/fetchMetadata";

type Props = {
  params: Promise<{ slug: string[] }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });

  return transformStaticParams(data);
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const slug = `/${(params.slug || []).join("/")}`;

  const metadata = await fetchMetadata({
    query: getPageQuery,
    slug,
  });

  return metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const slug = `/${(params.slug || []).join("/")}`;

  const [{ data: page }] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: { slug },
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <>
      <Head>
        <title>{page.heading}</title>
      </Head>
      <PageBuilderPage page={page} />
    </>
  );
}

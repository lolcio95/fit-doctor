import { sanityFetch } from "@/sanity/lib/live";
import { seoGlobal } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { Metadata } from "next";

const DEFAULT_TITLE = "Fitdoctor";

export const fetchMetadata = async ({
  query,
  slug,
}: {
  query: string;
  slug: string;
}): Promise<Metadata> => {
  try {
    const [{ data: page }, { data: defaultValues }] = await Promise.all([
      sanityFetch({
        query: query,
        params: { slug },
        // Metadata should never contain stega
        stega: false,
      }),
      sanityFetch({
        query: seoGlobal,
        stega: false,
      }),
    ]);

    const ogImage = resolveOpenGraphImage(
      page?.seo?.ogImage ?? defaultValues?.ogImage
    );

    const pageTitle = page?.title ?? "";
    const defaultTitle = defaultValues?.title?.replace(
      /\{\{title\}\}/g,
      pageTitle
    );
    const defaultOgTitle = defaultValues?.ogTitle?.replace(
      /\{\{title\}\}/g,
      pageTitle
    );

    return {
      title: page?.seo?.title || defaultTitle || DEFAULT_TITLE,
      description: page?.seo?.description || defaultValues?.description || "",
      openGraph: {
        title:
          page?.seo?.ogTitle ||
          defaultOgTitle ||
          page?.seo?.title ||
          defaultValues?.title ||
          DEFAULT_TITLE,
        description:
          page?.seo?.ogDescription || defaultValues?.ogDescription || "",
        images: ogImage,
        url:
          page?.seo?.ogUrl ||
          defaultValues?.ogUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL}${slug}`,
      },
      alternates: {
        canonical: page?.seo?.canonicalUrl,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      title: DEFAULT_TITLE,
      description: "",
      openGraph: {
        title: DEFAULT_TITLE,
        description: "",
        images: [],
        url: `${process.env.NEXT_PUBLIC_BASE_URL}${slug}`,
      },
    };
  }
};

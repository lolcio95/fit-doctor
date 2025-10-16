import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { getAllArticlesQuery, getArticleCategories } from "@/sanity/lib/queries";
import { ListOfArticles } from "@/app/components/organisms/ListOfArticles";
import { PER_PAGE } from "@/app/api/articles/consts";

/**
 * Generate metadata for the blog listing page.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog - Fitdoctor.pl",
    description:
      "Przeczytaj najnowsze artykuły o zdrowiu, diecie, treningu i suplementacji od ekspertów Fitdoctor.pl",
    openGraph: {
      title: "Blog - Fitdoctor.pl",
      description:
        "Przeczytaj najnowsze artykuły o zdrowiu, diecie, treningu i suplementacji od ekspertów Fitdoctor.pl",
      type: "website",
    },
  };
}

export default async function BlogPage() {
  // Fetch initial articles
  const { data: initialArticles } = await sanityFetch({
    query: getAllArticlesQuery,
    params: { pageStart: 0, pageEnd: PER_PAGE },
  });

  // Fetch categories
  const { data: categories } = await sanityFetch({
    query: getArticleCategories,
  });

  // Calculate articles metadata
  const articlesMetadata = {
    total: initialArticles?.length || 0,
    categories:
      categories?.map((cat) => ({
        categoryName: cat.categoryName || "",
        count: initialArticles?.filter(
          (article) => article.category?.categoryName === cat.categoryName
        ).length || 0,
      })) || [],
  };

  return (
    <section
      className="bg-background-secondary pt-16 md:pt-24"
      aria-labelledby="blog-title"
    >
      <div className="container pb-10">
        <h1 id="blog-title" className="text-4xl font-bold mb-8">
          Blog Fitdoctor.pl
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Najnowsze artykuły o zdrowiu, diecie, treningu i suplementacji od
          naszych ekspertów
        </p>
      </div>
      <ListOfArticles
        block={{
          title: "",
          type: "all",
          customArticles: [],
          initialArticles: initialArticles || [],
          categories: categories || [],
          articlesMetadata,
        }}
      />
    </section>
  );
}

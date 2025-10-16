import { fetchArticles } from "@/app/utils/fetchArticles";
import { GetRecentArticlesQueryResult } from "@/sanity.types";
import { useState, useMemo } from "react";
import { ListOFArticlesSectionProps } from "./";

export const usePaginatedArticles = (block: ListOFArticlesSectionProps) => {
  const { title, type, customArticles, categories, articlesMetadata, initialArticles } = block;
  const [articles, setArticles] = useState<GetRecentArticlesQueryResult>(initialArticles || []);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeCategory = async (category?: string) => {
    setArticlesLoading(true);
    const articles = await fetchArticles({ category, type, page: 0, search: searchTerm });
    setArticles(articles);
    setCurrentPage(0);
    setCurrentCategory(category);
    setArticlesLoading(false);
  };

  const onSearch = async (search?: string) => {
    setArticlesLoading(true);
    const articles = await fetchArticles({ 
      category: currentCategory, 
      type, 
      page: 0,
      search 
    });
    setArticles(articles);
    setCurrentPage(0);
    setSearchTerm(search);
    setArticlesLoading(false);
  };

  const fetchMoreArticles = async () => {
    setIsLoading(true);
    const page = currentPage + 1;
    const articles = await fetchArticles({
      type,
      page,
      category: currentCategory,
      search: searchTerm,
    });
    setArticles((prev) => [...prev, ...articles]);
    setCurrentPage(page);
    setIsLoading(false);
  };

    const metadata = useMemo(() => { 
      return articlesMetadata.categories.reduce<{
        [key: string]: { count: number };
      }>(
        (acc, cat) => {
          acc[cat.categoryName] = { count: cat.count };
          return acc;
        },
        { all: { count: articlesMetadata.total } }
      );
  }, [articlesMetadata]);

  return {
    title,
    articles: type === "custom" && customArticles?.length ? customArticles : articles,
    loading: articlesLoading,
    type,
    onChangeCategory,
    onSearch,
    categories,
    metadata,
    fetchMoreArticles,
    isLoading,
  }
}

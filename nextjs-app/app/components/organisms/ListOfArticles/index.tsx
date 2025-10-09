"use client";

import { BlogCardsSection } from "@/components/blocks/blog-cards-section";
import {
  GetRecentArticlesQueryResult,
  ListOfArticles as SanityListOfArticles,
} from "@/sanity.types";
import React from "react";
import { usePaginatedArticles } from "./hooks";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";

export interface ListOFArticlesSectionProps
  extends Omit<SanityListOfArticles, "customArticles" | "allArticlesButton"> {
  customArticles: GetRecentArticlesQueryResult;
  initialArticles: GetRecentArticlesQueryResult;
  categories: { categoryName: string }[];
  articlesMetadata: {
    categories: { categoryName: string; count: number }[];
    total: number;
  };
  allArticlesButton?: LabeledLinkType;
}

export interface ListOfArticlesProps {
  block: ListOFArticlesSectionProps;
}

export type ArticleMetadata = Record<
  string,
  {
    count: number;
  }
>;

export const ListOfArticles = ({ block }: ListOfArticlesProps) => {
  const {
    title,
    articles,
    categories,
    fetchMoreArticles,
    loading,
    metadata,
    onChangeCategory,
    type,
    isLoading,
  } = usePaginatedArticles(block);

  return (
    <BlogCardsSection
      title={title}
      articles={articles}
      loading={loading}
      type={type}
      onChangeCategory={onChangeCategory}
      categories={categories}
      metadata={metadata}
      fetchMoreArticles={fetchMoreArticles}
      backgroundColor={block.backgroundColor}
      isLoading={isLoading}
      allArticlesButton={block?.allArticlesButton}
    />
  );
};

import { AspectRatio } from "@/components/ui/aspect-ratio";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  GetRecentArticlesQueryResult,
  ListOfArticles,
  SimplerColor,
} from "@/sanity.types";
import { Select } from "@/app/components/molecules/Select";
import { Spinner } from "@/components/ui/Spinner";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { ArticleMetadata } from "@/app/components/organisms/ListOfArticles";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import clsx from "clsx";
import { Button } from "../ui/button";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { ArticlesList } from "@/app/components/molecules/ArticlesList";

interface BlogCardsSectionProps {
  title?: string;
  articles?: GetRecentArticlesQueryResult;
  loading?: boolean;
  categories?: { categoryName: string }[];
  onChangeCategory: (categoryName?: string) => void;
  type: ListOfArticles["type"];
  metadata: ArticleMetadata;
  fetchMoreArticles: () => void;
  backgroundColor?: SimplerColor;
  isLoading?: boolean;
  allArticlesButton?: LabeledLinkType;
}

export function BlogCardsSection({
  title,
  articles,
  loading,
  categories,
  type,
  onChangeCategory,
  metadata,
  fetchMoreArticles,
  backgroundColor,
  isLoading,
  allArticlesButton,
}: BlogCardsSectionProps) {
  const [totalArticlesCount, setTotalArticlesCount] = useState(0);

  const options = useMemo(
    () => [
      { label: "All", value: "all" },
      ...(categories?.map(({ categoryName }) => {
        return {
          label: categoryName,
          value: categoryName,
        };
      }) ?? []),
    ],
    [categories]
  );
  //TODO naprawić, aby nie zwracało nadmiarowych artykułów
  const articlesList =
    type === "recent" ? (articles ?? []).slice(0, 4) : (articles ?? []);

  useEffect(() => {
    setTotalArticlesCount(metadata["all"]?.count ?? 0);
  }, [metadata]);

  const hasMore =
    articles?.length &&
    (type !== "all" || totalArticlesCount > articles.length);

  const handleChange = useCallback(
    (category: string) => {
      setTotalArticlesCount(
        metadata[category]?.count || (articles || []).length
      );
      onChangeCategory(category === "all" ? undefined : category);
    },
    [setTotalArticlesCount, onChangeCategory, metadata, articles]
  );

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24 bg-background-secondary"
    >
      <div className="container mx-auto px-6">
        <div>
          <div className="mx-auto flex w-full flex-col justify-between gap-4 md:flex-row md:items-center mb-8 md:mb-12">
            <h2
              className={clsx(
                "text-3xl font-bold md:text-4xl text-color-tertiary"
              )}
            >
              {title}
            </h2>
            {type === "recent" || type === "custom" ? (
              <ButtonLink variant="outline" link={allArticlesButton} />
            ) : (
              <Select
                options={options}
                onChange={handleChange}
                placeholder="Category"
              />
            )}
          </div>
          {loading ? (
            <div className="relative">
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pb-18">
                {new Array(4).fill(0).map((_, index) => (
                  <AspectRatio key={index} ratio={4 / 3} />
                ))}
                <div className="absolute right-[50%] top-[10%] md:top-[50%] translate-x-[50%]">
                  <Spinner />
                </div>
              </div>
            </div>
          ) : articles?.length ? (
            <div>
              <div
                className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
                role="list"
              >
                <ArticlesList articles={articlesList} />
              </div>
              {hasMore && type === "all" && !isLoading && (
                <div className="flex items-center justify-center w-full h-14 mt-5">
                  <Button onClick={fetchMoreArticles}>Załaduj więcej</Button>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center justify-center w-full h-14 mt-5">
                  <Spinner />
                </div>
              )}
            </div>
          ) : (
            <h3 className="text-base leading-normal font-semibold group-hover:underline">
              Brak rezultatów dla wybranej kategorii.
            </h3>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

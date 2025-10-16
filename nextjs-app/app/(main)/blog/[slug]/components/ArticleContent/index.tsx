import { MediaImage } from "@/app/components/atoms/MediaImage";
import PageBuilder from "@/app/components/PageBuilder";
import { ArticleQueryResult, ArticleRichText, RichText } from "@/sanity.types";
import format from "date-fns/format";
import React from "react";
import { PortableText } from "@/app/components/atoms/PortableText";
import { TableOfContents } from "../TableOfContents";
import {
  BaseImageProps,
  BaseMediaImageProps,
} from "@/app/components/atoms/BaseImage/types";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { getHeadings } from "@/app/(main)/blog/[slug]/utils";

type Article = Omit<
  NonNullable<ArticleQueryResult>,
  "coverImage" | "author" | "content"
> & {
  content: ArticleRichText;
  coverImage: BaseMediaImageProps;
  author: Omit<
    NonNullable<ArticleQueryResult>["author"],
    "picture" | "bio" | "button"
  > & {
    picture?: BaseImageProps;
    bio: RichText;
    button?: LabeledLinkType;
    withButton: boolean;
    name: string;
  };
};
export interface ArticleContentProps {
  article: Article;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  const { date, category, author, coverImage, content, title } = article;
  const headings = getHeadings(content);

  return (
    <div className="flex flex-col lg:flex-row lg:gap-12">
      <article className="flex flex-col gap-12 lg:gap-8 lg:w-3/5">
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              <time>{format(new Date(date ?? ""), "MMMM d, yyyy")}</time>
            </p>
            <span className="text-muted-foreground text-sm">·</span>
            {category?.categoryName && (
              <p className="text-muted-foreground text-sm">
                {category.categoryName}
              </p>
            )}
          </div>
          <h1
            id="article-title"
            className="text-4xl leading-tight font-bold lg:text-5xl"
          >
            {title}
          </h1>
        </div>
        {author && (
          <div className="flex items-center gap-4">
            <div className="size-10 overflow-hidden rounded-full">
              <MediaImage
                simpleImage={author.picture}
                className="object-cover size-full"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold">{author.name}</p>
            </div>
          </div>
        )}
        <MediaImage mediaImage={coverImage} className="w-full rounded-md" />
        {content && <PortableText value={content} className="flex flex-col" />}
        {!!article.sections?.length && <PageBuilder page={article} />}
        {author && (
          <div className="flex gap-4 mt-4">
            {author.picture && (
              <div className="size-10 overflow-hidden rounded-full flex items-center justify-center">
                <MediaImage
                  simpleImage={author.picture}
                  className="object-cover size-full"
                />
              </div>
            )}
            <div className="flex flex-col flex-1">
              <p className="text-sm font-bold">{author.name}</p>
              <PortableText value={author.bio} className="text-[.875rem]" />
              {author.withButton && author.button?.label && (
                <div className="mt-4">
                  <ButtonLink
                    link={author.button}
                    className="w-full lg:w-auto"
                    variant="outline"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </article>
      {!headings || Object.keys(headings).length === 0 ? null : (
        <div className="relative hidden lg:block flex-1">
          <div className="sticky top-[5.625rem]">
            <TableOfContents headings={headings} />
          </div>
        </div>
      )}
    </div>
  );
};

import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import React, { memo } from "react";
import { GetRecentArticlesQueryResult } from "@/sanity.types";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { format } from "date-fns";
import isEqual from "lodash/isEqual";

interface ArticlesProps {
  articles: GetRecentArticlesQueryResult;
}

export const ArticlesList = memo(
  function Articles({ articles }: ArticlesProps) {
    return articles.map((post, index) => {
      const { slug, coverImage, date, category, title } = post;
      return (
        <Link href={slug?.current ?? ""} key={index} className="w-full">
          <div className="flex w-full flex-col gap-4 rounded-xl transition-all duration-200">
            <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-xl">
              <MediaImage
                //@ts-ignore
                mediaImage={coverImage}
                className="object-cover h-full"
                fill
                width={600}
                height={400}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, 360px"
                placeholder="blur"
                quality={60}
              />
            </AspectRatio>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-left">
                <span className="text-sm">
                  {format(new Date(date ?? ""), "MMM d, yyyy")}
                </span>
                <span className="text-sm">·</span>
                <span className="text-sm">{category?.categoryName}</span>
              </div>
              <h3 className="text-base leading-normal font-semibold group-hover:underline">
                {title}
              </h3>
            </div>
          </div>
        </Link>
      );
    });
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

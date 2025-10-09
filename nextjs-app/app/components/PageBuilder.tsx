import Link from "next/link";

import BlockRenderer from "@/app/components/BlockRenderer";
import { dataAttr } from "@/sanity/lib/utils";
import { studioUrl } from "@/sanity/lib/api";
import { GetPageQueryResult, ArticleQueryResult } from "@/sanity.types";

type Sections =
  | NonNullable<GetPageQueryResult>["sections"]
  | NonNullable<ArticleQueryResult>["sections"];

export type PageQueryResult<T extends Record<string, any> = {}> = {
  _id: string;
  _type: string;
  sections: Sections | null;
} & Record<string, any> &
  T;

type PageBuilderPageProps = {
  page: PageQueryResult | null;
};

type PageBuilderSection = {
  _key: string;
  _type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBuilderSection[];
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderSections(
  pageBuilderSections: PageBuilderSection[],
  page: PageQueryResult
) {
  if (!page) {
    return null;
  }
  return (
    <div
      data-sanity={dataAttr({
        id: page._id,
        type: page._type,
        path: `pageBuilder`,
      }).toString()}
    >
      {pageBuilderSections.map((block: any) => (
        <BlockRenderer
          key={block._key}
          block={block}
          pageId={page._id}
          pageType={page._type}
        />
      ))}
    </div>
  );
}

function renderEmptyState(page: PageQueryResult | null) {
  return (
    <div className="container">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        This page has no content!
      </h1>
      <p className="mt-2 text-base text-gray-500">
        Open the page in Sanity Studio to add content.
      </p>
      {page && (
        <div className="mt-10 flex">
          <Link
            className="rounded-full flex gap-2 mr-6 items-center bg-black hover:bg-red-500 focus:bg-cyan-500 py-3 px-6 text-white transition-colors duration-200"
            href={`${studioUrl}/studio/structure/${page._type};${page._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Add content to this page
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PageBuilder({ page }: PageBuilderPageProps) {
  if (!page) {
    return renderEmptyState(null);
  }
  const pageBuilderSections = page?.sections || [];

  return pageBuilderSections.length > 0
    ? renderSections(pageBuilderSections, page)
    : renderEmptyState(page);
}

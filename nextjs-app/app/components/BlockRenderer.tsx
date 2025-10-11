import React from "react";

import { dataAttr } from "@/sanity/lib/utils";
import dynamic from "next/dynamic";

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  block: BlockType;
  pageId: string;
  pageType: string;
};

const RichTextSection = dynamic(
  () => import("@/app/components/organisms/RichTextSection")
);
const MainHero = dynamic(() =>
  import("@/app/components/organisms/MainHero").then((mod) => mod.MainHero)
);
const Testimonials = dynamic(() =>
  import("@/app/components/organisms/Testimonials").then(
    (mod) => mod.Testimonials
  )
);
const BigImage = dynamic(() =>
  import("@/app/components/organisms/BigImage").then((mod) => mod.BigImage)
);
const ListOfArticles = dynamic(() =>
  import("@/app/components/organisms/ListOfArticles").then(
    (mod) => mod.ListOfArticles
  )
);

const Blocks: BlocksType = {
  sectionRichText: (block) => <RichTextSection {...block} />,
  mainHero: (block) => <MainHero {...block} />,
  testimonials: (block) => <Testimonials {...block} />,
  bigImage: (block) => <BigImage {...block} />,
  listOfArticles: (block) => <ListOfArticles {...block} />,
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({ block, pageId, pageType }: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        id={block._key}
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
        })}
      </div>
    );
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key }
  );
}

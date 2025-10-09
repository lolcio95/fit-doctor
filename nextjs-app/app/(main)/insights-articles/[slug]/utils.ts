import { ArticleRichText } from "@/sanity.types";

export type Headings = Record<string, { id: string; title: string }>;

export const getHeadings = (value?: ArticleRichText) => {
  if (!value?.richText) return {};

  const collectedHeadings: Headings = {};

  value.richText.forEach((block) => {
    if (
      block._type === "block" &&
      block.style &&
      ["h1", "h2", "h3", "h4"].includes(block.style)
    ) {
      const text = block.children?.[0]?.text ?? "";
      const id = block.children?.[0]?._key ?? "";

      if (text && !collectedHeadings[id]) {
        collectedHeadings[id] = { id, title: text };
      }
    }
  });

  return collectedHeadings;
};

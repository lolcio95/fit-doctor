/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  ArticleRichText,
  ParagraphWithDecoratorsRichText,
  RichText,
  SectionRichText,
  SimpleRichText,
} from "@/sanity.types";
import clsx from "clsx";
import {
  PortableText as SanityPortableText,
  type PortableTextComponents,
} from "next-sanity";
import dynamic from "next/dynamic";
import { getChildrenText, getContent } from "./utils";
import { BaseLink } from "../BaseLink";
import React from "react";

// Lazy load components with loading fallbacks
const RichTextTable = dynamic(() => import("./components/RichTextTable"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded" />,
});

const RichTextVideo = dynamic(() => import("./components/RichTextVideo"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

const RichTextImage = dynamic(() => import("./components/RichTextImage"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-40 rounded" />,
});

const HubspotForm = dynamic(
  () =>
    import("@/app/components/molecules/HubspotForm").then((mod) => ({
      default: mod.HubspotForm,
    })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
  }
);

export function PortableText({
  className,
  value,
  ulClassName,
  liClassName,
  listBullet,
  removeHardBreaks,
}: {
  className?: string;
  value?:
    | RichText
    | SimpleRichText
    | ArticleRichText
    | SectionRichText
    | ParagraphWithDecoratorsRichText;
  ulClassName?: string;
  liClassName?: string;
  listBullet?: React.ReactElement;
  removeHardBreaks?: boolean;
}) {
  const isArticleContent = value?._type === "articleRichText";

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p
          className={clsx({
            "leading-[1.75rem]": isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </p>
      ),
      h1: ({ children, value }) => (
        <h1
          id={value.children?.[0]._key ?? ""}
          className={clsx("text-4xl md:text-5xl", {
            "font-extrabold tracking-[-0.025rem]": isArticleContent,
            "font-bold": !isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </h1>
      ),
      h2: ({ children, value }) => (
        <h2
          id={value.children?.[0]._key ?? ""}
          className={clsx({
            "text-3xl font-semibold leading-[2.25rem] tracking-[-0.025rem]":
              isArticleContent,
            "text-3xl font-bold md:text-4xl": !isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </h2>
      ),
      h2alt: ({ children, value }) => (
        <h2
          id={value.children?.[0]._key ?? ""}
          className="text-2xl md:text-3xl font-bold"
        >
          {getContent(children, removeHardBreaks)}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          id={value.children?.[0]._key ?? ""}
          className="text-2xl font-semibold leading-[2.25rem] tracking-[-0.025rem]"
        >
          {getContent(children, removeHardBreaks)}
        </h3>
      ),
      h4: ({ children, value }) => (
        <h4
          id={value.children?.[0]._key ?? ""}
          className="text-xl font-semibold leading-[1.75rem] tracking-[-0.025rem]"
        >
          {getContent(children, removeHardBreaks)}
        </h4>
      ),
      paragraph: ({ children }) => (
        <p
          className={clsx({
            "leading-[1.75rem]": isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </p>
      ),
      responsiveParagraph: ({ children }) => (
        <p className="text-base lg:text-lg">
          {getContent(children, removeHardBreaks)}
        </p>
      ),
      lead: ({ children }) => (
        <p
          className={clsx("text-[1.25rem]", {
            "leading-[1.75rem]": isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </p>
      ),
      large: ({ children }) => (
        <p
          className={clsx("font-semibold text-[1.125rem]", {
            "leading-[1.75rem]": isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </p>
      ),
      small: ({ children }) => (
        <p
          className={clsx("text-[.875rem]", {
            "leading-[.875rem]": isArticleContent,
            "leading-5": !isArticleContent,
          })}
        >
          {getContent(children, removeHardBreaks)}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 pl-6 italic leading-[1.5rem]">
          {getContent(children, removeHardBreaks)}
        </blockquote>
      ),
    },
    marks: {
      sup: ({ children }) => <sup>{children}</sup>,
      sub: ({ children }) => <sub>{children}</sub>,
      simplerColor: ({ value, children }) => (
        <span style={{ color: (value as { value: string }).value }}>
          {children}
        </span>
      ),
      code: ({ children }) => (
        <code className="px-[.3rem] py-[.2rem] rounded-sm bg-sky-50 font-bold text-[.875rem]">
          {children}
        </code>
      ),
      left: ({ children }) => (
        <span className="block text-left">{children}</span>
      ),
      center: ({ children }) => (
        <span className="block text-center">{children}</span>
      ),
      right: ({ children }) => (
        <span className="block text-right">{children}</span>
      ),
      link: ({ children, value }) => {
        return (
          <BaseLink
            link={value}
            className="underline hover-never:opacity-80 transition-opacity"
          >
            {getChildrenText(children)}
          </BaseLink>
        );
      },
      blockquote: ({ children }) => (
        <blockquote>{getContent(children, removeHardBreaks)}</blockquote>
      ),
    },
    types: {
      simpleImage: ({ value }): JSX.Element => <RichTextImage value={value} />,
      table: ({ value }): JSX.Element => <RichTextTable table={value} />,
      video: ({ value }): JSX.Element => <RichTextVideo value={value} />,
      hubspotForm: ({ value }): JSX.Element => (
        <HubspotForm formId={value.formId} />
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={clsx(
            ulClassName ??
              "list-disc list-outside pl-5 ml-[.9375rem] flex flex-col gap-1 [&_ul]:list-[revert]"
          )}
        >
          {children}
        </ul>
      ),
      number: ({ children, value: { level } }) => (
        <ol
          className={clsx(
            "list-outside pl-4 ml-[.9375rem] flex flex-col gap-1 [&_li]:pl-1",
            {
              "list-[lower-alpha]": level === 2,
              "list-[lower-roman]": level === 3,
              "list-decimal": level < 2 || level > 3,
            }
          )}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className={liClassName}>
          {listBullet}
          {children}
        </li>
      ),
      number: ({ children }) => <li>{children}</li>,
    },
    hardBreak: () => <br />,
  };

  return (
    <div
      className={clsx(
        "prose prose-a:text-red-500",
        "text-color-tertiary",
        className
      )}
    >
      <SanityPortableText
        components={components}
        value={value?.richText ?? []}
      />
    </div>
  );
}

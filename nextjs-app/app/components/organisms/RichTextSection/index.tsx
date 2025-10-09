import { SectionRichText } from "@/sanity.types";
import React, { FC } from "react";
import { PortableText } from "@/app/components/atoms/PortableText";
import clsx from "clsx";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface RichTextSectionProps {
  block: SectionRichText;
}

const RichTextSection: FC<RichTextSectionProps> = ({ block }) => {
  const { isNarrow = false, withSpacing, backgroundColor } = block || {};

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className={clsx({
        "py-16 lg:py-24": withSpacing,
      })}
      defaultBgClassName="bg-slate-50"
    >
      <PortableText
        value={block}
        className={clsx("mx-auto px-6", {
          "max-w-3xl": isNarrow,
          container: !isNarrow,
        })}
      />
    </SectionWrapper>
  );
};

export default RichTextSection;

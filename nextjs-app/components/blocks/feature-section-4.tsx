import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { TextColumnsGrid } from "@/sanity.types";
import { getSecondaryTextColor } from "@/utils/colors";
import clsx from "clsx";

interface FeatureSection4Props extends TextColumnsGrid {}

export function FeatureSection4({
  title,
  columns,
  backgroundColor,
}: FeatureSection4Props) {
  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto flex flex-col gap-12 px-6 md:gap-16">
        <div className="mx-auto flex max-w-xl flex-col gap-4 text-center md:gap-5">
          <PortableText value={title} />
        </div>
        {!!columns?.length && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {columns.map((column) => {
              const { _key, title, description } = column;

              return (
                <div
                  className="flex flex-col items-center gap-8 text-center md:gap-6"
                  key={_key}
                >
                  <div className="flex flex-col gap-2">
                    {!!title && (
                      <h3
                        className={clsx(
                          secondaryTextColorClassName,
                          "text-xl font-bold"
                        )}
                      >
                        {title}
                      </h3>
                    )}
                    {!!description && <p>{description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

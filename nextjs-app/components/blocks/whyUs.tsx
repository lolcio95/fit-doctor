import { MediaImage } from "@/app/components/atoms/MediaImage";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { SanityWhyUsSectionProps } from "@/app/components/organisms/WhyUs";

interface WhyUsSectionProps extends Omit<SanityWhyUsSectionProps, "_type"> {}

export function WhyUsSection({
  whyUs,
  title,
  description,
  backgroundColor,
}: WhyUsSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-slate-50"
    >
      {(title || description) && (
        <div className="text-center max-w-3xl mx-auto mb-12 px-4">
          {title && (
            <h2 className="text-3xl lg:text-4xl font-extrabold text-color-secondary mb-4">
              {title}
            </h2>
          )}
          {description && <p className="text-md lg:text-lg">{description}</p>}
        </div>
      )}
      <div className="container mx-auto px-6 flex flex-wrap justify-center gap-8">
        {whyUs &&
          whyUs.map((item) => (
            <div
              key={item._key}
              className="group flex flex-col items-center mx-4 rounded-2xl bg-background-card w-[260px] p-4"
            >
              {item?.image && (
                <div className="w-10 h-10 mb-4">
                  <MediaImage
                    simpleImage={item.image}
                    width={40}
                    height={40}
                    asSvg
                    className="group-hover:text-white transition-colors"
                  />
                </div>
              )}
              <h3 className="text-lg text-center text-color-secondary font-semibold">
                {item.title}
              </h3>
              <h3 className="text-center mt-4 group-hover:text-white transition-colors">
                {item.description}
              </h3>
            </div>
          ))}
      </div>
    </SectionWrapper>
  );
}

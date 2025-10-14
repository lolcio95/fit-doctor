"use client";

import { TestimonialsSectionProps } from "@/app/components/organisms/Testimonials";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { Avatar } from "@radix-ui/react-avatar";
import { PortableText } from "@/app/components/atoms/PortableText";
import clsx from "clsx";

interface TestimonialsProps extends Omit<TestimonialsSectionProps, "_type"> {}

export function Testimonials({
  testimonials,
  title,
  description,
  backgroundColor,
}: TestimonialsProps) {
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
        {testimonials &&
          testimonials.map(({ _key, content, person }) => (
            <div
              key={_key}
              className="group flex flex-col items-center mx-4 rounded-2xl bg-background-card w-[260px] p-4 pt-12 relative mt-6 lg:mt-7"
            >
              {person && (
                <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <MediaImage
                      simpleImage={person.picture}
                      height={56}
                      width={56}
                      className="size-full object-cover rounded-full"
                    />
                  </Avatar>
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={clsx(
                        "text-sm font-semibold sm:text-base text-color-primary"
                      )}
                    >
                      {person.firstName} {person.lastName}
                    </span>
                    <span className="text-xs sm:text-sm">
                      {person.position}
                    </span>
                    <PortableText value={content} className="mt-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </SectionWrapper>
  );
}

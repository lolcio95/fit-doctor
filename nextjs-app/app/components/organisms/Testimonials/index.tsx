import { Person, Testimonials as SanityTestimonials } from "@/sanity.types";
import React from "react";
import { Testimonials as TestimonialsSection } from "@/components/blocks/testimonials-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type TestimonialsSectionProps = Omit<
  SanityTestimonials,
  "testimonials"
> & {
  testimonials?: (Omit<
    NonNullable<SanityTestimonials["testimonials"]>[number],
    "person"
  > & {
    person?: Omit<Person, "picture"> & {
      picture: BaseImageProps;
    };
  })[];
};

export interface TestimonialsProps {
  block: TestimonialsSectionProps;
}

export const Testimonials = ({ block }: TestimonialsProps) => {
  const { testimonials, backgroundColor, title, description } = block;

  return (
    <TestimonialsSection
      testimonials={testimonials ?? []}
      backgroundColor={backgroundColor}
      title={title}
      description={description}
    />
  );
};

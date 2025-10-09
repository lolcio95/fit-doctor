import { Person, Testimonials as SanityTestimonials } from "@/sanity.types";
import React from "react";
import { TestimonialsCarousel } from "@/components/blocks/testimonials-carousel";
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
  const { testimonials, backgroundColor } = block;

  return (
    <TestimonialsCarousel
      testimonials={testimonials ?? []}
      backgroundColor={backgroundColor}
    />
  );
};

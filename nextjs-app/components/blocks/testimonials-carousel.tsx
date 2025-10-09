"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { TestimonialsSectionProps } from "@/app/components/organisms/Testimonials";
import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { Avatar } from "../ui/avatar";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import {
  getButtonModeForBackground,
  getSecondaryTextColor,
} from "@/utils/colors";
import clsx from "clsx";

interface TestimonialsCarouselProps
  extends Omit<TestimonialsSectionProps, "_type"> {}

export function TestimonialsCarousel({
  testimonials,
  backgroundColor,
}: TestimonialsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!testimonials?.length) {
    return null;
  }

  const buttonMode = getButtonModeForBackground(backgroundColor?.label);
  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-slate-50"
      className="flex flex-col items-center px-6 py-16 lg:py-24"
    >
      <div className="w-full max-w-4xl">
        <Carousel className="relative mx-auto" setApi={setApi}>
          <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10 hidden items-center justify-between md:flex">
            <div className="pointer-events-auto">
              <CarouselPrevious
                variant={buttonMode}
                className="relative left-[-1rem] h-10 w-10"
              />
            </div>
            <div className="pointer-events-auto">
              <CarouselNext
                variant={buttonMode}
                className="relative right-[-1rem] h-10 w-10"
              />
            </div>
          </div>

          <CarouselContent className="px-2 sm:px-4">
            {testimonials.map(({ _key, content, person }) => (
              <CarouselItem key={_key} className="pt-4 md:pt-6">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-2 md:gap-8 md:px-4">
                  <PortableText value={content} />
                  {person && (
                    <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
                      <Avatar className="h-10 w-10 rounded-xl md:h-12 md:w-12 lg:h-14 lg:w-14">
                        <MediaImage
                          simpleImage={person.picture}
                          height={56}
                          width={56}
                          className="size-full object-cover"
                        />
                      </Avatar>
                      <div className="flex flex-col items-center gap-0.5 md:items-start">
                        <span
                          className={clsx(
                            secondaryTextColorClassName,
                            "text-sm font-semibold sm:text-base"
                          )}
                        >
                          {person.firstName} {person.lastName}
                        </span>
                        <span className="text-xs sm:text-sm">
                          {person.position}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex justify-center gap-1.5 md:hidden">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  current === i ? "bg-primary w-4" : "bg-muted-foreground/20"
                )}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </SectionWrapper>
  );
}

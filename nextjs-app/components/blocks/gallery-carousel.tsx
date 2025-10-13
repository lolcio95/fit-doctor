"use client";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { SanityGallerySectionProps } from "@/app/components/organisms/Gallery";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

type GallerySectionProps = Omit<SanityGallerySectionProps, "_type">;

export function GallerySection({
  title,
  description,
  gallery,
  backgroundColor,
}: GallerySectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // AUTOPLAY: zmiana slajdu co 5 sekund
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Czyszczenie timera po odmontowaniu lub zmianie api
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24 w-full max-w-[56.25rem] mx-auto"
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
      <Carousel className="relative mx-auto" setApi={setApi}>
        <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10 items-center justify-between flex">
          <div className="pointer-events-auto">
            <CarouselPrevious
              variant="default"
              className="relative top-[.625rem] left-[32px] h-10 w-10"
            />
          </div>
          <div className="pointer-events-auto">
            <CarouselNext
              variant="default"
              className="relative top-[.625rem] right-[32px] h-10 w-10"
            />
          </div>
        </div>
        {gallery && (
          <CarouselContent className="px-2 sm:px-4">
            {gallery.map((item) => (
              <CarouselItem key={item.alt} className="">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-2 md:gap-8 md:px-4">
                  <MediaImage
                    simpleImage={item}
                    width={100}
                    height={100}
                    className="w-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
        <div className="flex gap-2 absolute bottom-5 left-[50%] translate-x-[-50%]">
          {new Array(count).fill(0).map((_, index) => (
            <div
              key={index}
              className={clsx(
                "w-2.5 h-2.5 rounded-full transition-colors duration-500",
                {
                  "bg-color-secondary": index === current,
                  "bg-background-card": index !== current,
                }
              )}
            ></div>
          ))}
        </div>
      </Carousel>
    </SectionWrapper>
  );
}

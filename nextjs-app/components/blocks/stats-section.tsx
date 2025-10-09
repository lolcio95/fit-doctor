"use client";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { Stats } from "@/sanity.types";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface StatsSectionProps extends Omit<Stats, "_type"> {}

export function StatsSection({
  title,
  stats,
  backgroundColor,
}: StatsSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "100px",
  });

  const animatedNumberText = (text: string = "", inView: boolean = false) => {
    const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);

    if (!match) return <span>{text}</span>;

    const [, numberPart, suffix] = match;

    return (
      <>
        {inView ? <CountUp end={parseFloat(numberPart)} /> : 0}
        {suffix}
      </>
    );
  };

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 lg:py-24"
      defaultBgClassName="bg-secondary text-secondary-foreground"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8 md:gap-12" ref={ref}>
          <div className="mx-auto flex max-w-xl flex-col gap-4">
            <PortableText value={title} />
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-x-0 flex-wrap justify-center">
            {stats?.map((stat) => (
              <div
                className="stat-item flex w-full flex-col gap-2 text-center md:gap-3 md:max-w-1/3"
                key={stat._key}
              >
                <p className="text-4xl font-bold md:text-5xl">
                  {animatedNumberText(stat.statText, inView)}
                </p>
                <p className="opacity-80 text-base">{stat.statDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

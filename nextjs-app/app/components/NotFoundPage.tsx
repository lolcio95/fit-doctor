import React, { FC } from "react";
import Image from "next/image";
import { ButtonLink } from "./atoms/ButtonLink";

const NotFoundPage: FC = () => {
  return (
    <section className="bg-background overflow-hidden grow px-10 flex-col flex">
      <div className="container lg:max-w-[75rem] mx-auto relative grow flex-col flex">
        <Image
          src="/assets/logo-decor-1.svg"
          alt="Logo decor"
          width={774}
          height={603}
          className="absolute transform-[translate(-14.6rem,-5.8rem)]"
        />
        <Image
          src="/assets/logo-decor-2.svg"
          alt="Logo decor"
          width={774}
          height={603}
          className="absolute top-0 bottom-0 right-0 left-auto transform-[translate(40rem,.5rem)]"
        />
        <div className="w-full py-16 md:py-24 grow items-center justify-center">
          <h1 className="text-center mb-12 text-8xl font-bold leading-[1.1] tracking-[-0.06rem] text-blue-950">
            404
          </h1>
          <div className="flex justify-center mb-5">
            <ButtonLink
              link={{
                label: "Back Home",
                resource: { slug: "/" },
                type: "internalLink",
                section: null,
                mediaLink: null,
              }}
            />
          </div>
          <h2 className="text-center text-[2rem] md:text-[2.5rem] font-bold leading-[1.1] tracking-[-0.06rem] text-blue-950">
            It looks like the page you are looking for is unavailable or has
            been replaced.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;

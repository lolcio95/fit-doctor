import React, { FC } from "react";
import Image from "next/image";
import { ButtonLink } from "./atoms/ButtonLink";

const NotFoundPage: FC = () => {
  return (
    <section className="bg-background-primary overflow-hidden grow px-10 flex-col flex">
      <div className="container lg:max-w-[75rem] mx-auto relative grow flex-col flex">
        <div className="w-full py-16 md:py-24 grow items-center justify-center">
          <h1 className="text-center mb-12 text-8xl font-bold leading-[1.1] tracking-[-0.06rem] text-color-tertiary">
            404
          </h1>
          <div className="flex justify-center mb-5">
            <ButtonLink
              link={{
                label: "Wróć na stronę główną",
                resource: { slug: "/" },
                type: "internalLink",
                section: null,
                mediaLink: null,
              }}
            />
          </div>
          <h2 className="text-center text-[2rem] md:text-[2.5rem] font-bold leading-[1.1] tracking-[-0.06rem] text-color-tertiary">
            Wygląda na to, że strona, której szukasz, jest niedostępna lub
            została zastąpiona.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;

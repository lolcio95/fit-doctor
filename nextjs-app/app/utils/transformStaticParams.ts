import { PagesSlugsResult } from "@/sanity.types";

export const transformStaticParams = (data: PagesSlugsResult) => {
    return data.map((item) => ({
      slug: item?.slug ? item.slug.replace(/^\//, "").split("/") : null,
    }));
  };
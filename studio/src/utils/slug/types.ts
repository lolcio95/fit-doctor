import { SlugOptions } from "sanity";

export interface MakePrefixedPageSlugOptionsParams
  extends Omit<SlugOptions, "source"> {
  prefix: string;
}

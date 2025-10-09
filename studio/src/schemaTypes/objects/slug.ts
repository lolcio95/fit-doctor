import { defineField } from "sanity";
import { makeBaseSlugValidator, makeSlugPrefixValidator } from "../../utils/validation";
import { defaultSlugifier, isSlugUnique } from "../../utils/slug";

export default defineField({
  title: "Slug",
  name: "slug",
  type: "slug",
  description: 'Slug has to start with a "/"',
  validation: makeBaseSlugValidator(makeSlugPrefixValidator("/")),
  options: {
    source: "title",
    slugify: defaultSlugifier,
    isUnique: isSlugUnique
  }
});

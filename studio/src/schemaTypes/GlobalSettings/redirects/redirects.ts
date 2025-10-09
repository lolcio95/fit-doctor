import { defineField, defineType, Rule } from "sanity"
import globalSettings from "../../objects/globalSettings"
import published from "../../objects/published"
import { makeBaseSlugValidator, makeSlugPrefixValidator } from "../../../utils/validation"
import { makeVisibleFieldValidator } from "../../../utils/misc"

export const redirects = defineType({
  name: 'redirects',
  title: 'Redirects',
  type: 'document',
  description: '',
  fields: [
    {
      type: 'array',
      name: 'redirects',
      of: [
        {
          type: 'object',
          name: 'redirect',
          fields: [
              defineField({
                title: "Source Slug",
                name: "sourceSlug",
                type: "slug",
                description: 'Enter source slug',
                validation: (rule) => makeBaseSlugValidator(makeSlugPrefixValidator("/"))(rule.required().custom((value, context) => {
                  if (!value || !value.current) {
                    return true;
                  }
                  const duplicates = Array.isArray(context.document?.redirects) 
                    ? context.document.redirects.filter(item => item.sourceSlug?.current === value.current) 
                    : [];
                  if (duplicates.length > 1) {
                    return 'Slugs cannot be repeated';
                  }

                  return true;
                })),
              }),
              defineField({
                title: 'Resource',
                name: 'resource',
                type: 'internalLink',
                validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
              }),
          ],
          preview: {
            select: {
              title: 'sourceSlug.current',
            }
          }
        }
      ]
    },
    
    globalSettings,
    published,
  ],
  options: {
    publishOnly: true,
    creatable: false,
  },
  preview: {
    prepare() {
      return {
        title: 'Redirects',
      }
    },
  },
})
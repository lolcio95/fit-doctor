import {defineType, Rule} from 'sanity'
import {mediaAssetSource} from 'sanity-plugin-media'
import {makeVisibleFieldValidator} from '../../utils/misc'

export const simpleImage = defineType({
  name: 'simpleImage',
  type: 'object',
  fields: [
    {
      name: 'image',
      type: 'image',
      options: {
        sources: [mediaAssetSource],
      },
      validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
    },
    {
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
    },
    {
      name: 'caption',
      title: 'Image caption',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'image',
    },
    prepare({title = 'Image', media}: {title?: string; media?: string}) {
      return {
        title,
        media,
      }
    },
  },
})

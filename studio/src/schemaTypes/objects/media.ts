import {defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {mediaAssetSource} from 'sanity-plugin-media'

export const media = defineType({
  name: 'media',
  title: 'Media',
  icon: ImageIcon,
  type: 'object',
  fields: [
    {
      name: 'mobileImage',
      title: 'Mobile image',
      type: 'image',
      options: {
        sources: [mediaAssetSource],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'desktopImage',
      title: 'Desktop image',
      type: 'image',
      options: {
        sources: [mediaAssetSource],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'altText',
      media: 'mobileImage',
    },
  },
})

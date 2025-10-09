import {defineType} from 'sanity'
import globalSettings from '../../objects/globalSettings'
import published from '../../objects/published'

export const socialMedia = defineType({
  name: 'socialMedia',
  title: 'Social media',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'simpleImage',
      validation: (rule) => rule.required(),
    },
    {
      name: 'socialsUrl',
      title: 'Link',
      type: 'url',
      validation: (rule) => rule.required(),
    },
    globalSettings,
    published,
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image.image',
    },
  },
})

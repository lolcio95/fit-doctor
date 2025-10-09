import {defineType} from 'sanity'
import globalSettings from '../../objects/globalSettings'
import published from '../../objects/published'

export const articlesSettings = defineType({
  name: 'articlesSettings',
  title: 'Articles Settings',
  type: 'document',
  description: 'Default values ​​for selected article sections after article creation',
  fields: [
    {
      name: 'listOfArticles',
      title: 'List Of Articles',
      type: 'listOfArticles',
      description: 'Display latest articles',
      validation: (rule) => rule.required(),
    },
    {
      name: 'cta',
      title: 'CTA',
      type: 'cta',
      validation: (rule) => rule.required(),
    },
    {
      name: 'newsletter',
      title: 'Newsletter',
      type: 'newsletter',
      validation: (rule) => rule.required(),
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
        title: 'Article Settings',
      }
    },
  },
})

import {defineType, defineField} from 'sanity'
import Groups from '../../../setup/groups'

export const seoSettings = defineType({
  name: 'seoSettings',
  type: 'object',
  description: 'These are the default values for SEO tags. You can interpolate values by wrapping them in double curly braces. For example, {{title}} will be replaced with the value of the title field of the page.',
  groups: [
    Groups.SEO_DEFAULT,
    Groups.SEO_OPEN_GRAPH,
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: `The page title displayed in search results and browser tabs. You can add {{title}} to the text in order to interpolate page's title`,
      group: Groups.SEO_DEFAULT.name,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'A short page description visible in search results',
      group: Groups.SEO_DEFAULT.name,
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for Open Graph metadata',
      group: Groups.SEO_OPEN_GRAPH.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'string',
      description: 'Description for Open Graph metadata',
      group: Groups.SEO_OPEN_GRAPH.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'An image used in link previews',
      group: Groups.SEO_OPEN_GRAPH.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ogUrl',
      title: 'Open Graph URL',
      type: 'url',
      description: 'URL for Open Graph metadata',
      group: Groups.SEO_OPEN_GRAPH.name,
    }),
  ],
  preview: {
    prepare: () => {
      return {
        title: 'SEO Settings'
      }
    }
  }
})
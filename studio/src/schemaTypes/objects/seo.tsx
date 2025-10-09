import {defineType, defineField} from 'sanity'
import Groups from '../../setup/groups'

export const seo = defineType({
  name: 'seo',
  type: 'object',
  groups: [Groups.SEO_DEFAULT, Groups.SEO_OPEN_GRAPH],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The page title displayed in search results and browser tabs',
      group: Groups.SEO_DEFAULT.name,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'A short page description visible in search results',
      group: Groups.SEO_DEFAULT.name,
    }),
    defineField({
      name: 'noIndex',
      title: 'No index',
      type: 'boolean',
      description: 'If true, the page will not be indexed by search engines',
      group: Groups.SEO_DEFAULT.name,
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for Open Graph metadata',
      group: Groups.SEO_OPEN_GRAPH.name,
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'string',
      description: 'Description for Open Graph metadata',
      group: Groups.SEO_OPEN_GRAPH.name,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'An image used in link previews',
      group: Groups.SEO_OPEN_GRAPH.name,
    }),
    defineField({
      name: 'ogUrl',
      title: 'Open Graph URL',
      type: 'url',
      description: 'URL for Open Graph metadata',
      group: Groups.SEO_OPEN_GRAPH.name,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'canonical URL for current page',
      group: Groups.SEO_DEFAULT.name,
    }),
  ],
})

import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {makePrefixedPageSlugOptions} from '../../utils/slug'
import Groups from '../../setup/groups'
import {extendModel} from '../../utils/model'
import slug from '../objects/slug'

const ARTICLE_PREFIX = '/blog/'

export const article = defineType({
  name: 'article',
  title: 'Article',
  icon: DocumentTextIcon,
  type: 'document',
  groups: [Groups.INFO, Groups.MAIN, Groups.SEO],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: Groups.MAIN.name,
      validation: (rule) => rule.required(),
    }),
    extendModel(slug, {
      name: 'slug',
      group: Groups.MAIN.name,
      options: makePrefixedPageSlugOptions({
        prefix: ARTICLE_PREFIX,
        maxLength: 96,
      }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'media',
      group: Groups.MAIN.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'articleRichText',
      group: Groups.MAIN.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'sections',
      group: Groups.MAIN.name,
      description: 'Fields for adding many components',
    }),
    {
      name: 'withListOfArticles',
      title: 'With List Of Articles?',
      initialValue: false,
      type: 'boolean',
      group: Groups.MAIN.name,
      description:
        'Decide if you want to add custom content for latest articles. If false, the content will be taken from default settings',
    },
    defineField({
      name: 'listOfArticles',
      title: 'List Of Articles',
      type: 'listOfArticles',
      group: Groups.MAIN.name,
      description: 'Display latest articles',
      hidden: ({parent}) => !parent?.withListOfArticles,
    }),
    {
      name: 'withCta',
      title: 'With CTA?',
      initialValue: false,
      type: 'boolean',
      group: Groups.MAIN.name,
      description:
        'Decide if you want to add custom content for CTA. If false, the content will be taken from default settings',
    },
    {
      name: 'withNewsletter',
      title: 'With Newsletter?',
      initialValue: false,
      type: 'boolean',
      group: Groups.MAIN.name,
      description:
        'Decide if you want to add custom content for newsletter. If false, the content will be taken from default settings',
    },
    defineField({
      name: 'newsletter',
      title: 'Newsletter',
      type: 'newsletter',
      group: Groups.MAIN.name,
      hidden: ({parent}) => !parent?.withNewsletter,
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      group: Groups.INFO.name,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      group: Groups.INFO.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'articleCategory'}],
      group: Groups.INFO.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: Groups.SEO.name,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage.mobileImage',
    },
  },
})

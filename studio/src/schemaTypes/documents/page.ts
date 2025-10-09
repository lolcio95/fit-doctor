import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import Groups from '../../setup/groups'
import {extendModel} from '../../utils/model'
import slug from '../objects/slug'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [Groups.MAIN, Groups.SEO],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: Groups.MAIN.name,
      description: 'Main title',
      validation: (Rule) => Rule.required(),
    }),
    extendModel(slug, {
      name: 'slug',
      group: Groups.MAIN.name,
      options: {
        maxLength: 96,
      },
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'sections',
      group: Groups.MAIN.name,
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
    },
  },
})

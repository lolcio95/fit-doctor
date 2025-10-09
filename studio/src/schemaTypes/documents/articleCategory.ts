import {SelectIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const articleCategory = defineType({
  name: 'articleCategory',
  title: 'Article Category',
  icon: SelectIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'categoryName',
      title: 'Category Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'categoryName',
    },
  },
})
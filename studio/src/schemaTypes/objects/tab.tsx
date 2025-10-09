import {defineType, defineField} from 'sanity'

export const tab = defineType({
  name: 'tab',
  title: 'Tab',
  type: 'object',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tabsSections',
      title: 'Tab sections',
      type: 'tabsSections',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})

import {TextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonAnnotations} from './consts'

export const paragraphWithDecoratorsRichText = defineType({
  name: 'paragraphWithDecoratorsRichText',
  title: 'Rich Text',
  icon: TextIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'richText',
      title: 'Rich text',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Inline code', value: 'code'},
            ],
            annotations: commonAnnotations,
          },
          styles: [],
        }),
      ],
    }),
  ],
})

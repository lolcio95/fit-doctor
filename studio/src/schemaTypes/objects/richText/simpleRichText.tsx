import {TextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonAnnotations, commonParagraphStyles} from './consts'

export const simpleRichText = defineType({
  name: 'simpleRichText',
  title: 'Simple Rich Text',
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
          styles: commonParagraphStyles,
        }),
      ],
    }),
  ],
})

import {TextIcon, ImageIcon, VideoIcon, ThLargeIcon, DocumentSheetIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {blockContentPreview} from '../../../utils/blockContentPreview'
import {commonAnnotations, commonDecorators, commonParagraphStyles} from './consts'

export const richText = defineType({
  name: 'richText',
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
              ...commonDecorators,
              {
                title: 'Blockquote',
                value: 'blockquote',
                component: (props) => <blockquote>{props.children}</blockquote>,
              },
            ],
            annotations: commonAnnotations,
          },
          styles: [
            {title: 'Heading 1 (mobile: 36px, desktop: 48px)', value: 'h1'},
            {title: 'Heading 2 (mobile: 30px, desktop: 36px)', value: 'h2'},
            {
              title: 'Heading 2 (alt) (mobile: 24px, desktop: 30px)',
              value: 'h2alt',
              component: (props) => (
                <h2 style={{fontSize: 30, margin: 0, fontWeight: '700'}}>{props.children}</h2>
              ),
            },
            {title: 'Heading 3 (24px)', value: 'h3'},
            {title: 'Heading 4 (20px)', value: 'h4'},
            {
              title: 'Responsive paragraph (mobile: 16px, desktop: 18px)',
              value: 'responsiveParagraph',
              component: (props) => (
                <p style={{fontSize: 18, margin: 0, fontWeight: '400'}}>{props.children}</p>
              ),
            },
            ...commonParagraphStyles,
            {
              title: 'Blockquote',
              value: 'blockquote',
            },
          ],
        }),
        defineArrayMember({
          title: 'Image',
          type: 'simpleImage',
          icon: ImageIcon,
        }),
        defineArrayMember({
          title: 'Table',
          type: 'table',
          icon: ThLargeIcon,
        }),
        defineArrayMember({
          title: 'Video',
          type: 'video',
          icon: VideoIcon,
        }),
        defineArrayMember({
          title: 'HubSpot Form',
          type: 'hubspotForm',
          icon: DocumentSheetIcon,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'richText',
    },
    prepare({title}) {
      return {
        title: blockContentPreview(title),
        subtitle: 'Rich text field',
      }
    },
  },
})

import {TextIcon, ImageIcon, VideoIcon, ThLargeIcon, DocumentSheetIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {blockContentPreview} from '../../../utils/blockContentPreview'
import {commonAnnotations, commonDecorators} from './consts'

export const articleRichText = defineType({
  name: 'articleRichText',
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
            decorators: commonDecorators,
            annotations: commonAnnotations,
          },
          styles: [
            {title: 'Heading 1 (mobile: 36px, desktop: 48px)', value: 'h1'},
            {title: 'Heading 2 (30px)', value: 'h2'},
            {title: 'Heading 3 (24px)', value: 'h3'},
            {title: 'Heading 4 (20px)', value: 'h4'},
            {
              title: 'Paragraph (16px)',
              value: 'paragraph',
              component: (props) => (
                <p style={{fontSize: 16, margin: 0, fontWeight: '400'}}>{props.children}</p>
              ),
            },
            {
              title: 'Lead (20px)',
              value: 'lead',
              component: (props) => (
                <p style={{fontSize: 20, margin: 0, fontWeight: '400'}}>{props.children}</p>
              ),
            },
            {
              title: 'Large (18px)',
              value: 'large',
              component: (props) => (
                <p style={{fontSize: 18, margin: 0, fontWeight: '600'}}>{props.children}</p>
              ),
            },
            {
              title: 'Small (14px)',
              value: 'small',
              component: (props) => (
                <p style={{fontSize: 14, margin: 0, fontWeight: '500'}}>{props.children}</p>
              ),
            },
            {
              title: 'Blockquote',
              value: 'blockquote',
              component: (props) => (
                <blockquote
                  style={{
                    fontSize: 16,
                    margin: 0,
                    fontWeight: '400',
                    fontStyle: 'italic',
                    lineHeight: '1.5rem',
                    borderColor: '#ccc',
                    borderLeftWidth: '2px',
                    paddingLeft: '1rem',
                  }}
                >
                  {props.children}
                </blockquote>
              ),
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

import {ImageIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const testimonials = withDefaultGroup(
  extendModel(section, {
    name: 'testimonials',
    title: 'Testimonials',
    icon: ImageIcon,
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'testimonials',
        type: 'array',
        of: [
          {
            name: 'testimonial',
            type: 'object',
            fields: [
              {
                name: 'content',
                title: 'Content',
                type: 'richText',
              },
              {
                name: 'person',
                title: 'Person',
                type: 'reference',
                to: [{type: 'person'}],
              },
            ],
            preview: {
              select: {
                firstName: 'person.firstName',
                lastName: 'person.lastName',
                title: 'content.richText',
                subtitle: 'person.firstName',
                media: 'person.picture.image',
              },
              prepare({
                title = '',
                firstName = '',
                lastName = '',
                media,
              }: {
                title?: string
                firstName?: string
                lastName?: string
                media?: string
              }) {
                return {
                  title: blockContentPreview(title),
                  subtitle: `${firstName} ${lastName}`,
                  media: media,
                }
              },
            },
          },
        ],
      },
    ],
    initialValue: {
      backgroundColor: colorsMap['Background Primary'],
    },
    preview: {
      prepare() {
        return {
          title: 'Testimonials',
        }
      },
    },
  }),
)

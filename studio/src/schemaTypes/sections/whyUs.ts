import {ImageIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const whyUs = withDefaultGroup(
  extendModel(section, {
    name: 'whyUs',
    title: 'Why Us',
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
        name: 'whyUs',
        type: 'array',
        of: [
          {
            name: 'Card',
            type: 'object',
            fields: [
              {
                name: 'image',
                title: 'Image',
                type: 'simpleImage',
              },
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
            ],
            preview: {
              select: {
                title: 'title',
                subtitle: 'description',
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
          title: 'whyUs',
        }
      },
    },
  }),
)
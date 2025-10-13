import {ImageIcon} from '@sanity/icons'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'


export const gallery = withDefaultGroup(
  extendModel(section, {
    name: 'gallery',
    title: 'Gallery',
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
        name: 'gallery',
        type: 'array',
        of: [
          {
            name: 'Image',
            type: 'simpleImage',
            preview: {
              select: {
                title: 'title',
                media: 'simpleImage.image',
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
      prepare(): { title: string } {
        return {
          title: 'Gallery',
        }
      },
    },
  }),
)
import {DashboardIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const iconHighlights = withDefaultGroup(
  extendModel(section, {
    name: 'iconHighlights',
    title: 'Icon Highlights',
    type: 'object',
    icon: DashboardIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'highlights',
        type: 'array',
        of: [
          {
            name: 'highlight',
            title: 'Highlight',
            type: 'object',

            fields: [
              {
                name: 'icon',
                title: 'Icon',
                type: 'simpleImage',
              },
              {
                name: 'title',
                title: 'Title',
                type: 'text',
              },
              {
                name: 'description',
                title: 'Description',
                type: 'richText',
              },
            ],
            preview: {
              select: {
                title: 'title',
                subtitle: 'description.richText',
                media: 'icon.image',
              },
            },
          },
        ],
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'title.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Icon highlights section',
        }
      },
    },
  }),
)

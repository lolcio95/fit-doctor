import {ImageIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const featuresWithIcons = withDefaultGroup(
  extendModel(section, {
    name: 'featuresWithIcons',
    title: 'Features With Icons',
    type: 'object',
    icon: ImageIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'cards',
        type: 'array',
        of: [
          {
            name: 'card',
            title: 'Card',
            type: 'object',

            fields: [
              {
                name: 'icon',
                title: 'Icon',
                type: 'object',
                fields: [
                  {
                    name: 'image',
                    type: 'image',
                    validation: (rule: Rule) => rule.required(),
                  },
                  {
                    name: 'alt',
                    title: 'Alt text',
                    type: 'string',
                    validation: (rule: Rule) => rule.required(),
                  },
                ],
              },
              {
                name: 'content',
                title: 'Content',
                type: 'richText',
                validation: (rule: Rule) => rule.required(),
              },
            ],
            preview: {
              select: {
                title: 'content.richText',
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
          subtitle: 'Features with icons section',
        }
      },
    },
  }),
)

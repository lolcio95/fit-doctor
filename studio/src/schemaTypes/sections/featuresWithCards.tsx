import {BlockElementIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const featuresWithCards = withDefaultGroup(
  extendModel(section, {
    name: 'featuresWithCards',
    title: 'Features With Cards',
    type: 'object',
    icon: BlockElementIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
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
                type: 'simpleImage',
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
      backgroundColor: colorsMap['Muted Light'],
    },
    preview: {
      select: {
        title: 'title.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Features with cards section',
        }
      },
    },
  }),
)

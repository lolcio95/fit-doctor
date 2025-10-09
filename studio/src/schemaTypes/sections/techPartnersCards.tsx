import {BlockElementIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const techPartnersCards = withDefaultGroup(
  extendModel(section, {
    name: 'techPartnersCards',
    title: 'Tech Partners Cards',
    type: 'object',
    icon: BlockElementIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'cards',
        type: 'array',
        validation: (rule: Rule) => rule.required(),
        of: [
          {
            name: 'card',
            title: 'Card',
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'text',
                validation: (rule: Rule) => rule.required(),
              },
              {
                name: 'image',
                title: 'Image',
                type: 'simpleImage',
                validation: (rule: Rule) => rule.required(),
              },
              {
                name: 'link',
                title: 'Link',
                type: 'link',
                validation: (rule: Rule) => rule.required(),
              },
            ],
            preview: {
              select: {
                title: 'title',
                media: 'image.image',
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
          subtitle: 'Tech partners cards section',
        }
      },
    },
  }),
)

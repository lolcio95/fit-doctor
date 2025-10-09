import {ImagesIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const featuresWithLogos = withDefaultGroup(
  extendModel(section, {
    name: 'featuresWithLogos',
    title: 'Features With Logos',
    type: 'object',
    icon: ImagesIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        title: 'Features',
        name: 'features',
        type: 'array',
        of: [
          {
            name: 'feature',
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
                name: 'content',
                title: 'Content',
                type: 'richText',
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
                subtitle: 'content.richText',
              },
            },
          },
        ],
        validation: (Rule: Rule) => Rule.max(10),
      },
      {
        title: 'Logos',
        name: 'logos',
        type: 'array',
        of: [
          {
            name: 'logo',
            title: 'Logo',
            type: 'simpleImage',
          },
        ],
        validation: (Rule: Rule) => Rule.max(10),
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
          title: blockContentPreview(title, 'Features with logos section'),
          subtitle: 'Features with logos section',
        }
      },
    },
  }),
)

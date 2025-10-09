import {ImageIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const featuresWithImage = withDefaultGroup(
  extendModel(section, {
    name: 'featuresWithImage',
    title: 'Features With Image',
    type: 'object',
    icon: ImageIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'media',
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
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'title.richText',
        media: 'image.mobileImage',
      },
      prepare({title = '', media}: {title?: string; media?: string}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Features with image section',
          media,
        }
      },
    },
  }),
)

import {Rule} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const twoColumns = withDefaultGroup(
  extendModel(section, {
    name: 'twoColumns',
    title: 'Two columns',
    type: 'object',
    icon: ImageIcon,
    fields: [
      {
        name: 'text',
        type: 'richText',
        title: 'Text',
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'image',
        type: 'media',
        title: 'Image',
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'imagePosition',
        title: 'Image position',
        initialValue: 'right',
        type: 'string',
        options: {
          list: [
            {title: 'Left', value: 'left'},
            {title: 'Right', value: 'right'},
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'text.richText',
        media: 'image.mobileImage',
      },
      prepare({title = '', media}: {title?: string; media?: string}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Two columns section',
          media: media,
        }
      },
    },
  }),
)

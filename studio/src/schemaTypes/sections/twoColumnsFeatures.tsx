import {ComponentIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import { colorsMap } from '../../setup/sectionColors'

export const twoColumnsFeatures = withDefaultGroup(
  extendModel(section, {
    name: 'twoColumnsFeatures',
    title: 'Two Columns Features',
    type: 'object',
    icon: ComponentIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'leftColumn',
        title: 'Left Column',
        type: 'richText',
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'rightColumn',
        title: 'Right Column',
        type: 'richText',
        validation: (Rule: Rule) => Rule.required(),
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Brand,
    },
    preview: {
      select: {
        title: 'title.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Two Columns Features section',
        }
      },
    },
  }),
)

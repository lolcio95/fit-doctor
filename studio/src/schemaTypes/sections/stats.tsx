import {SchemaIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const stats = withDefaultGroup(
  extendModel(section, {
    name: 'stats',
    title: 'Stats',
    type: 'object',
    icon: SchemaIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'stats',
        type: 'array',
        of: [
          {
            name: 'stat',
            title: 'Stat',
            type: 'object',

            fields: [
              {
                name: 'statText',
                title: 'Stat Text',
                type: 'string',
                validation: (rule: Rule) => rule.required(),
              },
              {
                name: 'statDescription',
                title: 'Stat Description',
                type: 'string',
                validation: (rule: Rule) => rule.required(),
              },
            ],
            preview: {
              select: {
                title: 'statText',
                subtitle: 'statDescription',
              },
            },
          },
        ],
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
          subtitle: 'Stats section',
        }
      },
    },
  }),
)

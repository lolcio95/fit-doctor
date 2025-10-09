import {DashboardIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import { colorsMap } from '../../setup/sectionColors'

export const steps = withDefaultGroup(
  extendModel(section, {
    name: 'steps',
    title: 'Steps Section',
    type: 'object',
    icon: DashboardIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'items',
        type: 'array',
        of: [
          {
            name: 'step',
            title: 'Step',
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'text',
                validation: (Rule: Rule) => Rule.required(),
              },
              {
                name: 'description',
                title: 'Description',
                type: 'richText',
                validation: (Rule: Rule) => Rule.required(),
              },
              {
                name: 'tag',
                title: 'Tag',
                type: 'text',
                validation: (Rule: Rule) => Rule.required(),
              },
            ],
            preview: {
              select: {
                title: 'title',
                subtitle: 'description.richText',
              },
              prepare({title = '', subtitle = ''}: {title?: string; subtitle?: string}) {
                return {
                  title: title || 'Step title',
                  subtitle: blockContentPreview(subtitle),
                }
              },
            },
          },
        ],
        validation: (Rule: Rule) => Rule.min(1).max(10),
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
          subtitle: 'Steps section',
        }
      },
    },
  }),
)

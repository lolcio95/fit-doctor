import {ImagesIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import { colorsMap } from '../../setup/sectionColors'

export const teamCards = withDefaultGroup(
  extendModel(section, {
    name: 'teamCards',
    title: 'Team Cards',
    type: 'object',
    icon: ImagesIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'cards',
        type: 'array',
        of: [
          {
            name: 'personCard',
            type: 'object',
            fields: [
              {
                name: 'person',
                type: 'reference',
                to: [{type: 'person'}],
              },
              {
                name: 'description',
                title: 'Description',
                type: 'text',
                description: 'Describe person position',
              },
            ],
            preview: {
              select: {
                firstName: 'person.firstName',
                lastName: 'person.lastName',
                media: 'person.picture.image',
                subtitle: 'description',
              },
              prepare({
                firstName = '',
                lastName = '',
                media,
                subtitle = '',
              }: {
                firstName?: string
                lastName?: string
                media?: string
                subtitle?: string
              }) {
                return {
                  title: `${firstName} ${lastName}`,
                  subtitle,
                  media,
                }
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
          subtitle: 'Team cards section',
        }
      },
    },
  }),
)

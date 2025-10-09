import {BlockElementIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import { colorsMap } from '../../setup/sectionColors'

export const teamIcons = withDefaultGroup(
  extendModel(section, {
    name: 'teamIcons',
    title: 'Team Icons',
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
        name: 'teamIcons',
        type: 'array',
        validation: (rule: Rule) => rule.required(),
        of: [
          {
            name: 'teamIcon',
            type: 'object',

            fields: [
              {
                name: 'person',
                title: 'Person',
                type: 'reference',
                to: [{type: 'person'}],
              },
            ],
            preview: {
              select: {
                firstName: 'person.firstName',
                lastName: 'person.lastName',
                media: 'person.picture.image',
              },
              prepare({
                firstName = '',
                lastName = '',
                media,
              }: {
                firstName?: string
                lastName?: string
                media?: string
              }) {
                return {
                  title: `${firstName} ${lastName}`,
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
          subtitle: 'Team icons section',
        }
      },
    },
  }),
)

import {Rule} from 'sanity'
import {ImagesIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const contactTeam = withDefaultGroup(
  extendModel(section, {
    name: 'contactTeam',
    title: 'Contact Team',
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
        name: 'advisors',
        title: 'Advisors',
        description: 'Add advisors that will be linked on the website',
        validation: (rule: Rule) => rule.min(1).max(6).unique(),
        type: 'array',
        of: [
          {
            name: 'advisorCard',
            title: 'Advisor',
            type: 'object',
            fields: [
              {
                name: 'advisor',
                type: 'reference',
                to: [{type: 'advisor'}],
                validation: (rule: Rule) => rule.required(),
              },
            ],
            preview: {
              select: {
                firstName: 'advisor.firstName',
                lastName: 'advisor.lastName',
                media: 'advisor.picture.image',
                subtitle: 'advisor.position',
              },
              prepare({
                firstName,
                lastName,
                media,
                subtitle,
              }: {
                firstName?: string
                lastName?: string
                media?: string
                subtitle?: string
              }) {
                const name = [firstName, lastName].filter(Boolean).join(' ')

                return {
                  title: name || 'Advisor name',
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
          subtitle: 'Contact team section',
        }
      },
    },
  }),
)

import {Rule} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const faq = withDefaultGroup(
  extendModel(section, {
    name: 'faq',
    title: 'FAQ',
    type: 'object',
    icon: BlockContentIcon,
    fields: [
      {
        name: 'content',
        title: 'Content',
        type: 'richText',
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'groups',
        title: 'Groups',
        type: 'array',
        of: [
          {
            name: 'group',
            type: 'object',
            fields: [
              {
                name: 'groupTitle',
                title: 'Group Title',
                type: 'string',
              },
              {
                name: 'items',
                title: 'Items',
                type: 'array',
                of: [
                  {
                    name: 'item',
                    type: 'object',
                    fields: [
                      {
                        name: 'question',
                        type: 'string',
                        title: 'Question',
                        validation: (rule: Rule) => rule.required(),
                      },
                      {
                        name: 'answer',
                        type: 'richText',
                        title: 'Answer',
                        validation: (rule: Rule) => rule.required(),
                      },
                    ],
                    preview: {
                      select: {
                        title: 'question',
                        subtitle: 'answer.richText',
                      },
                    },
                  },
                ],
                validation: (rule: Rule) => rule.min(1),
              },
            ],
            preview: {
              select: {
                title: 'groupTitle',
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
        title: 'content.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'FAQ section',
        }
      },
    },
  }),
)

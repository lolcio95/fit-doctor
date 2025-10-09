import {BlockContentIcon} from '@sanity/icons'
import { withDefaultGroup } from '../../utils/enhancers'
import { extendModel } from '../../utils/model'
import { section } from '../objects/section'
import { Rule } from 'sanity'
import { colorsMap } from '../../setup/sectionColors'

export const tabbedList = withDefaultGroup(
  extendModel(section, {
    name: 'tabbedList',
    title: 'Tabbed List',
    type: 'object',
    icon: BlockContentIcon,
    fields: [
      {
        name: 'tabs',
        type: 'array',
        of: [
          {
            name: 'tab',
            type: 'object',
            fields: [
              {
                name: 'tabTitle',
                title: 'Tab Title',
                type: 'string',
                validation: (rule: Rule) => rule.required(),
              },
              {
                name: 'tabIcon',
                title: 'Icon',
                type: 'simpleImage',
                validation: (rule: Rule) => rule.required(),
              },
              {
                name: 'list',
                type: 'array',
                validation: (rule: Rule) => rule.required(),
                of: [
                  {
                    name: 'listItem',
                    type: 'object',
                    fields: [
                      {
                        name: 'itemTitle',
                        title: 'Item Title',
                        type: 'string',
                        validation: (rule: Rule) => rule.required(),
                      },
                      {
                        name: 'itemDescription',
                        title: 'Item Description',
                        type: 'text',
                        validation: (rule: Rule) => rule.required(),
                      },
                    ],
                    preview: {
                      select: {
                        title: 'itemTitle',
                        subtitle: 'item description',
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      prepare: () => {
        return {
          title: 'Tabbed List section',
        }
      },
    },
  }),
)

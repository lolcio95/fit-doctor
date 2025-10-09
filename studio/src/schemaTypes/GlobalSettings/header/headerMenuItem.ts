import {defineType, Rule} from 'sanity'
import {makeVisibleFieldValidator} from '../../../utils/misc'

export const headerMenuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'array',
  validation: (Rule) => Rule.max(6),
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'hasSubmenu',
          title: 'Has submenu',
          type: 'boolean',
          initialValue: false,
          description: 'Decide whether it should be a single link or a drop-down list with links',
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          hidden: ({parent}) => !parent?.hasSubmenu,
          validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
        },
        {
          name: 'link',
          title: 'Link',
          type: 'labeledLink',
          hidden: ({parent}) => parent?.hasSubmenu,
          validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
        },
        {
          name: 'submenu',
          title: 'Submenu',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'link',
                  title: 'Link',
                  type: 'labeledLink',
                  validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
                },
              ],
              preview: {
                select: {
                  title: 'link.label',
                },
              },
            },
          ],
          hidden: ({parent}) => !parent?.hasSubmenu,
          validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
        },
      ],
      preview: {
        select: {
          submenuTitle: 'title',
          linkTitle: 'link.label',
          hasSubmenu: 'hasSubmenu',
        },
        prepare({submenuTitle, linkTitle, hasSubmenu}) {
          return {
            title: hasSubmenu ? submenuTitle : linkTitle,
          }
        },
      },
    },
  ],
})

import {MenuIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import globalSettings from '../../objects/globalSettings'
import published from '../../objects/published'

export const header = defineType({
  name: 'header',
  title: 'Header',
  icon: MenuIcon,
  type: 'document',
  fields: [
    {
      name: 'menuItems',
      title: 'Menu items',
      type: 'menuItem',
    },
    {
      name: 'buttons',
      type: 'array',
      validation: (Rule) => Rule.max(2),
      of: [
        {
          name: 'buttons',
          title: 'Buttons',
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              initialValue: 'outline',
              options: {
                list: [
                  {title: 'Outline', value: 'outline'},
                  {title: 'Fill', value: 'fill'},
                ],

                layout: 'radio',
                direction: 'horizontal',
              },
            },
            {
              name: 'link',
              title: 'Link',
              type: 'labeledLink',
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'link.label',
            },
          },
        },
      ],
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'simpleImage',
    },
    globalSettings,
    published,
  ],
  options: {
    publishOnly: true,
    creatable: false
  },
  preview: {
    prepare() {
      return {
        title: 'Header',
      }
    },
  },
})

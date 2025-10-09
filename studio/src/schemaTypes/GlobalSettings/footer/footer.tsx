import {defineType} from 'sanity'
import globalSettings from '../../objects/globalSettings'
import published from '../../objects/published'
import Groups from '../../../setup/groups'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  groups: [Groups.TOP, Groups.BOTTOM],
  fields: [
    {
      name: 'footerMenuItems',
      title: 'Menu items',
      type: 'footerMenuItem',
      group: Groups.TOP.name,
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'simpleImage',
      group: Groups.BOTTOM.name,
    },
    {
      name: 'references',
      title: 'References',
      description: 'References to privacy policy, cookies etc.',
      type: 'array',
      group: Groups.BOTTOM.name,
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'link',
              type: 'labeledLink',
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
      name: 'socials',
      title: 'socials',
      type: 'array',
      group: Groups.BOTTOM.name,
      validation: (rule) => rule.max(3),
      of: [
        {
          name: 'socialMedia',
          title: 'Social Media',
          type: 'reference',
          to: {type: 'socialMedia'},
        },
      ],
    },
    globalSettings,
    published,
  ],
  options: {
    publishOnly: true,
    creatable: false,
  },
  preview: {
    prepare() {
      return {
        title: 'Footer',
      }
    },
  },
})

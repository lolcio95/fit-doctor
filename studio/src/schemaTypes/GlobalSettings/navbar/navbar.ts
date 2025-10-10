import {MenuIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import globalSettings from '../../objects/globalSettings'
import published from '../../objects/published'

export const navbar = defineType({
  name: 'navbar',
  title: 'Navbar',
  icon: MenuIcon,
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'simpleImage',
    },
    {
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [{type: 'labeledLink'}]
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
        title: 'Navbar',
      }
    },
  },
})
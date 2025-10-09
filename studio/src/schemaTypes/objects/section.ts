import {defineType, defineField} from 'sanity'
import Groups from '../../setup/groups'
import {ColorWheelIcon} from '@sanity/icons'
import { colorsMap } from '../../setup/sectionColors'

export const section = defineType({
  name: 'section',
  type: 'object',
  groups: [Groups.APPEARANCE],
  fields: [
    defineField({
      name: 'backgroundColor',
      type: 'simplerColor',
      title: 'Color',
      icon: ColorWheelIcon,
      group: Groups.APPEARANCE.name,
      options: {
        colorList: Object.values(colorsMap),
      },
    }),
  ],
})

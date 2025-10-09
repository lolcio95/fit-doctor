import {ComponentIcon} from '@sanity/icons'
import {defineField, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const whyUs = withDefaultGroup(
  extendModel(section, {
    name: 'whyUs',
    title: 'Why us',
    type: 'object',
    icon: ComponentIcon,
    fields: [
      defineField({
        name: 'content',
        title: 'Content',
        type: 'richText',
        validation: (Rule: Rule) => Rule.required(),
      }),
      defineField({
        name: 'image',
        title: 'Image',
        type: 'simpleImage',
        validation: (Rule: Rule) => Rule.required(),
      }),
      defineField({
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
        validation: (Rule: Rule) => Rule.required(),
      }),
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'content.richText',
        media: 'image.image',
      },
      prepare({title = '', media}: {title?: string; media?: string}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Why us section',
          media,
        }
      },
    },
  }),
)

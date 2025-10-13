import {HomeIcon} from '@sanity/icons'
import {defineField, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const mainHero = withDefaultGroup(
  extendModel(section, {
    name: 'mainHero',
    title: 'Main Hero',
    type: 'object',
    icon: HomeIcon,
    fields: [
      defineField({
        name: 'image',
        title: 'Image',
        type: 'media',
        validation: (rule: Rule) =>
          rule.custom((_, context) => {
            const parent = context.parent as {type?: string; image?: object}
            if (parent.type === 'image' && !parent.image) {
              return 'Image is required'
            }
            return true
          }),
      }),
      defineField({
        name: 'title',
        title: 'Title',
        type: 'text',
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
      }),
      defineField({
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
      })
    ],
    initialValue: {
      backgroundColor: colorsMap.Muted,
    },
    preview: {
      select: {
        title: 'title.richText',
        subtitle: 'description.richText',
      },
      prepare({title = '', subtitle = ''}: {title?: string; subtitle?: string}) {
        return {
          title: blockContentPreview(title),
          subtitle: `Main hero section | ${blockContentPreview(subtitle)}`,
          media: HomeIcon,
        }
      },
    },
  }),
)

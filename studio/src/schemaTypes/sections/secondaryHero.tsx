import {HomeIcon} from '@sanity/icons'
import {ConditionalPropertyCallbackContext, defineField, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'
import {makeVisibleFieldValidator} from '../../utils/misc'

export const secondaryHero = withDefaultGroup(
  extendModel(section, {
    name: 'secondaryHero',
    title: 'Secondary Hero',
    type: 'object',
    icon: HomeIcon,
    fields: [
      defineField({
        name: 'withImage',
        title: 'Include image?',
        type: 'boolean',
      }),
      defineField({
        name: 'logo',
        title: 'Logo',
        type: 'simpleImage',
        hidden: ({parent}: ConditionalPropertyCallbackContext) => !parent?.withImage,
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
      }),
      defineField({
        name: 'tag',
        title: 'Tag',
        type: 'text',
      }),
      defineField({
        name: 'title',
        title: 'Title',
        type: 'richText',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'withButton',
        title: 'With Button',
        type: 'boolean',
        initialValue: false,
      }),
      defineField({
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
        hidden: ({parent}) => !parent?.withButton,
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
      }),
    ],
    initialValue: {
      backgroundColor: colorsMap.Muted,
      withImage: false,
    },
    preview: {
      select: {
        title: 'title.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Secondary hero section',
        }
      },
    },
  }),
)

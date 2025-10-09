import {ImagesIcon} from '@sanity/icons'
import {ConditionalPropertyCallbackContext, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {makeVisibleFieldValidator} from '../../utils/misc'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const logos = withDefaultGroup(
  extendModel(section, {
    name: 'logos',
    title: 'Logos',
    type: 'object',
    icon: ImagesIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'withButton',
        title: 'Include button?',
        initialValue: false,
        type: 'boolean',
      },
      {
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
        hidden: ({parent}: ConditionalPropertyCallbackContext) => !parent?.withButton,
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
      },
      {
        name: 'logos',
        type: 'array',
        validation: (Rule: Rule) => Rule.required(),
        of: [
          {
            name: 'logo',
            title: 'Logo',
            type: 'simpleImage',
          },
        ],
        preview: {
          select: {
            title: 'logo.alt',
            media: 'logo',
          },
          prepare({title, media}: {title?: string; media?: string}) {
            return {
              title: title || 'Logo',
              media,
            }
          },
        },
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'title.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Logos section',
        }
      },
    },
  }),
)

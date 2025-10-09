import {BinaryDocumentIcon} from '@sanity/icons'
import {defineField, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'
import {makeVisibleFieldValidator} from '../../utils/misc'

export const cta = withDefaultGroup(
  extendModel(section, {
    name: 'cta',
    title: 'CTA',
    type: 'object',
    icon: BinaryDocumentIcon,
    fields: [
      defineField({
        name: 'text',
        title: 'Text',
        type: 'richText',
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
        description: `CTA title, e.g., 'Join us!' or 'Download the e-book and a short CTA description, e.g., 'Sign up for our newsletter and get an exclusive discount.`,
      }),
      defineField({
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
        description: 'Button link',
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
      }),
    ],
    initialValue: {
      backgroundColor: colorsMap['Brand Gradient'],
    },
    preview: {
      select: {
        title: 'text.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'CTA section',
        }
      },
    },
  }),
)

import {CommentIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const contactForm = withDefaultGroup(
  extendModel(section, {
    name: 'contactForm',
    title: 'Contact Form',
    type: 'object',
    icon: CommentIcon,
    fields: [
      {
        name: 'withContent',
        type: 'boolean',
        title: 'With Content',
        description: 'Decide if you want to display contact form with additional text.',
      },
      {
        name: 'content',
        title: 'Content',
        type: 'richText',
        hidden: ({parent}: {parent: {withContent?: boolean}}) => !parent?.withContent,
      },
      {
        name: 'formId',
        title: 'Form ID',
        type: 'string',
        description:
          'Add form ID as a reference to the form. Go to https://app-eu1.hubspot.com/forms/145940524/views/all_forms -> Actions -> Share -> Embed code, and copy formId',
        validation: (rule: Rule) => rule.required(),
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'content.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Contact form section',
        }
      },
    },
  }),
)

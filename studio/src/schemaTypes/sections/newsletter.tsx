import {ImagesIcon} from '@sanity/icons'
import {Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'
import {makeVisibleFieldValidator} from '../../utils/misc'

export const newsletter = withDefaultGroup(
  extendModel(section, {
    name: 'newsletter',
    title: 'Newsletter',
    type: 'object',
    icon: ImagesIcon,
    fields: [
      {
        name: 'content',
        title: 'Content',
        type: 'richText',
      },
      {
        name: 'formId',
        title: 'Form ID',
        type: 'string',
        description:
          'Add form ID as a reference to the form. Go to https://app-eu1.hubspot.com/forms/145940524/views/all_forms -> Actions -> Share -> Embed code, and copy formId',
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
      },
    ],
    initialValue: {
      backgroundColor: colorsMap['Muted Light'],
    },
    preview: {
      select: {
        title: 'content.richText',
      },
      prepare({title = ''}) {
        return {
          title: blockContentPreview(title),
          subtitle: 'Newsletter section',
        }
      },
    },
  }),
)

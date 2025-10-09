import {ComponentIcon} from '@sanity/icons'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const table = withDefaultGroup(
  extendModel(section, {
    name: 'tableObject',
    title: 'Table',
    type: 'object',
    icon: ComponentIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'text',
      },
      {
        name: 'table',
        title: 'Table',
        type: 'table',
        description:
          'Type "+" inside any cell to display a checkmark or leave it blank to display nothing. Any other characters will be displayed as a text',
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Muted,
    },
    preview: {
      select: {
        title: 'title',
      },
      prepare({title = ''}) {
        return {
          title,
          subtitle: 'Table section',
        }
      },
    },
  }),
)

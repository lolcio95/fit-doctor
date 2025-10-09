import {ImageIcon} from '@sanity/icons'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const ethos = withDefaultGroup(
  extendModel(section, {
    name: 'ethos',
    title: 'Ethos',
    type: 'object',
    icon: ImageIcon,
    fields: [
      {
        name: 'subtitle',
        title: 'Subtitle',
        type: 'text',
      },
      {
        name: 'content',
        title: 'Content',
        type: 'richText',
      },
      {
        name: 'person',
        title: 'Person',
        type: 'reference',
        to: [{type: 'person'}],
      },
      {
        name: 'button',
        title: 'Button',
        type: 'labeledLink',
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Brand,
    },
    preview: {
      select: {
        title: 'subtitle',
      },
      prepare({title = ''}) {
        return {
          title: title,
          subtitle: 'Ethos section',
        }
      },
    },
  }),
)

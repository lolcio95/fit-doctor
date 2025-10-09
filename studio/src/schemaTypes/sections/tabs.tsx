import {BlockContentIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const tabs = withDefaultGroup(
  extendModel(section, {
    name: 'tabs',
    title: 'Tabs',
    type: 'object',
    icon: BlockContentIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'tabs',
        type: 'array',
        of: [{type: 'tab'}],
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
          subtitle: 'Tabs section',
        }
      },
    },
  }),
)

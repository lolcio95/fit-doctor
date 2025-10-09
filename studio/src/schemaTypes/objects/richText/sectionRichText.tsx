import {defineField} from 'sanity'
import {articleRichText} from './articleRichText'
import {extendModel} from '../../../utils/model'
import {section} from '../section'
import {TextIcon} from '@sanity/icons'
import {colorsMap} from '../../../setup/sectionColors'
import {withDefaultGroup} from '../../../utils/enhancers'
import {blockContentPreview} from '../../../utils/blockContentPreview'
import Groups from '../../../setup/groups'

export const sectionRichText = withDefaultGroup(
  extendModel(
    section,
    {
      title: 'Rich Text',
      icon: TextIcon,
      type: 'object',
      name: 'sectionRichText',
      fields: [
        ...articleRichText.fields,
        defineField({
          name: 'isNarrow',
          title: 'Narrow width',
          type: 'boolean',
          group: Groups.APPEARANCE.name,
          description: 'Use narrow width for this section',
        }),
        defineField({
          name: 'withSpacing',
          title: 'Add spacings',
          type: 'boolean',
          group: Groups.APPEARANCE.name,
          description: 'Add top and bottom spacing to this section',
        }),
      ],
      initialValue: {
        backgroundColor: colorsMap.Light,
        isNarrow: false,
        withSpacing: false,
      },
      preview: {
        select: {
          title: 'richText',
        },
        prepare({title = ''}: {title?: string}) {
          return {
            title: blockContentPreview(title),
            subtitle: 'Rich text section',
          }
        },
      },
    },
    {
      arrayJoinOrder: 'sourceToDest',
    },
  ),
)

import {BlockContentIcon} from '@sanity/icons'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import { colorsMap } from '../../setup/sectionColors'

export const textColumnsGrid = withDefaultGroup(
  extendModel(section, {
    name: 'textColumnsGrid',
    title: 'Text Columns Grid',
    icon: BlockContentIcon,
    type: 'object',
    fields: [
      {
        name: 'title',
        type: 'richText',
        title: 'title',
      },
      {
        name: 'columns',
        title: 'Columns',
        type: 'array',
        validation: (rule: Rule) => rule.required().min(1),
        of: [
          {
            name: 'column',
            title: 'Column',
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'string',
              },
              {
                name: 'description',
                title: 'Description',
                type: 'string',
              },
            ],
          },
        ],
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
          title: `${blockContentPreview(title, 'Text Columns Grid')}`,
          subtitle: 'Text Columns Grid section',
        }
      },
    },
  }),
)

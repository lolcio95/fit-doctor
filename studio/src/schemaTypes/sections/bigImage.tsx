import {ImageIcon} from '@sanity/icons'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {Rule} from 'sanity'
import {withDefaultGroup} from '../../utils/enhancers'
import {colorsMap} from '../../setup/sectionColors'

export const bigImage = withDefaultGroup(
  extendModel(section, {
    name: 'bigImage',
    title: 'Big Image',
    icon: ImageIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'text',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'media',
        validation: (rule: Rule) => rule.required(),
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Light,
    },
    preview: {
      select: {
        title: 'title',
        media: 'image.mobileImage',
      },
      prepare({title = '', media}: {title?: string; media?: string}) {
        return {
          title,
          subtitle: 'Big image section',
          media,
        }
      },
    },
  }),
)

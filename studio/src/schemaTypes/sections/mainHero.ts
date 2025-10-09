import {HomeIcon} from '@sanity/icons'
import {ConditionalPropertyCallbackContext, defineField, Rule, StringRule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

export const mainHero = withDefaultGroup(
  extendModel(section, {
    name: 'mainHero',
    title: 'Main Hero',
    type: 'object',
    icon: HomeIcon,
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'richText',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'richText',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'type',
        title: 'Media Type',
        type: 'string',
        description: 'Decide whether you want to display an image or video',
        initialValue: 'image',
        options: {
          list: [
            {title: 'Image', value: 'image'},
            {title: 'Video', value: 'video'},
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
      }),
      defineField({
        name: 'image',
        title: 'Image',
        type: 'media',
        hidden: ({parent}: ConditionalPropertyCallbackContext) => parent.type !== 'image',
        validation: (rule: Rule) =>
          rule.custom((_, context) => {
            const parent = context.parent as {type?: string; image?: object}
            if (parent.type === 'image' && !parent.image) {
              return 'Image is required'
            }
            return true
          }),
      }),
      defineField({
        name: 'videoId',
        title: 'Video ID',
        type: 'text',
        description:
          'Open the video on You Tube, click share and copy its ID, which is located after “https://youtu.be/”',
        hidden: ({parent}: ConditionalPropertyCallbackContext) => parent.type !== 'video',
        validation: (rule: StringRule) =>
          rule.custom((_, context) => {
            const parent = context.parent as {type?: string; videoId?: string}
            if (parent.type === 'video' && !parent.videoId) {
              return 'Video is required'
            }
            return true
          }),
      }),
      {
        name: 'buttons',
        type: 'array',
        validation: (Rule: Rule) =>
          Rule.custom((buttons) => {
            if (Array.isArray(buttons) && buttons.length > 2) {
              return 'You can add max 2 buttons'
            }
            return true
          }),
        of: [
          {
            name: 'buttons',
            title: 'Buttons',
            type: 'object',

            fields: [
              {
                name: 'type',
                title: 'Type',
                type: 'string',
                initialValue: 'outline',
                options: {
                  list: [
                    {title: 'Outline', value: 'outline'},
                    {title: 'Fill', value: 'fill'},
                  ],

                  layout: 'radio',
                  direction: 'horizontal',
                },
                description: 'Decide if the button should have a background or not',
              },
              {
                name: 'link',
                title: 'Link',
                type: 'labeledLink',
                validation: (rule: Rule) => rule.required(),
              },
            ],
            preview: {
              select: {
                title: 'link.label',
              },
            },
          },
        ],
      },
    ],
    initialValue: {
      backgroundColor: colorsMap.Muted,
    },
    preview: {
      select: {
        title: 'title.richText',
        subtitle: 'description.richText',
      },
      prepare({title = '', subtitle = ''}: {title?: string; subtitle?: string}) {
        return {
          title: blockContentPreview(title),
          subtitle: `Main hero section | ${blockContentPreview(subtitle)}`,
          media: HomeIcon,
        }
      },
    },
  }),
)

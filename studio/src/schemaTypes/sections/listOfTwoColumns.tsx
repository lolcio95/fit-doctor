import {ConditionalPropertyCallbackContext, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import {makeVisibleFieldValidator} from '../../utils/misc'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {colorsMap} from '../../setup/sectionColors'

export const listOfTwoColumns = withDefaultGroup(
  extendModel(section, {
    name: 'listOfTwoColumns',
    title: 'List Of Two Columns',
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'richText',
      },
      {
        name: 'firstImagePosition',
        title: 'First Image position',
        initialValue: 'right',
        type: 'string',
        description: 'Position of the first image on the list.',
        options: {
          list: [
            {title: 'Left', value: 'left'},
            {title: 'Right', value: 'right'},
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
      },
      {
        name: 'imageAspectRatio',
        title: 'Image Aspect Ratio',
        type: 'string',
        initialValue: '4:3',
        description: 'Height to width ratio of the photo.',
        options: {
          list: [
            {title: '4:3', value: '4:3'},
            {title: '1:1', value: '1:1'},
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
      },
      {
        name: 'list',
        title: 'List',
        type: 'array',
        of: [
          {
            name: 'item',
            title: 'Two Columns',
            type: 'object',
            fields: [
              {
                name: 'text',
                type: 'richText',
                title: 'Text',
                validation: (Rule: Rule) => Rule.required(),
              },
              {
                name: 'displayButton',
                title: 'Display Button?',
                type: 'boolean',
                description: 'Decide if you want to add a button.',
                initialValue: false,
              },
              {
                name: 'button',
                title: 'Button',
                type: 'labeledLink',
                hidden: ({parent}: ConditionalPropertyCallbackContext) => !parent?.displayButton,
                validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
              },
              {
                name: 'image',
                type: 'media',
                title: 'Image',
                validation: (Rule: Rule) => Rule.required(),
              },
              {
                name: 'imageAppearance',
                type: 'string',
                title: 'Image Appearance',
                description: 'How the image should be displayed.',
                initialValue: 'cover',
                options: {
                  list: [
                    {title: 'Cover', value: 'cover'},
                    {title: 'Contain', value: 'contain'},
                  ],
                  layout: 'radio',
                  direction: 'horizontal',
                },
              },
            ],
            preview: {
              select: {
                title: 'text.richText',
                media: 'image.mobileImage',
              },
            },
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
          title: blockContentPreview(title),
          subtitle: 'List Of Two Columns',
        }
      },
    },
  }),
)

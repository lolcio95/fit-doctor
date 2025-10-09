import {DashboardIcon} from '@sanity/icons'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import {ConditionalPropertyCallbackContext, Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'

export const downloadCards = withDefaultGroup(
  extendModel(section, {
    name: 'downloadCards',
    title: 'Download Cards',
    type: 'object',
    icon: DashboardIcon,
    fields: [
      {
        name: 'cards',
        type: 'array',
        of: [
          {
            name: 'card',
            title: 'Card',
            type: 'object',

            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'text',
              },
              {
                name: 'image',
                title: 'Image',
                type: 'simpleImage',
              },
              {
                name: 'content',
                title: 'Content',
                type: 'richText',
              },
              {
                name: 'button',
                title: 'Button',
                type: 'object',
                fields: [
                  {
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                  },
                ],
              },
              {
                name: 'downloadViaEmail',
                title: 'Download via Email',
                type: 'boolean',
                description:
                  'Decide whether to download the file directly to your device or send the download link to your email.',
                initialValue: false,
              },
              {
                name: 'formId',
                title: 'Form ID',
                type: 'string',
                description:
                  'Add form ID as a reference to the form. Go to https://app-eu1.hubspot.com/forms/145940524/views/all_forms -> Actions -> Share -> Embed code, and copy formId',
                hidden: ({parent}: ConditionalPropertyCallbackContext) => !parent.downloadViaEmail,
                validation: (rule: Rule) =>
                  rule.custom((_, context) => {
                    const parent = context.parent as {downloadViaEmail?: boolean; formId?: string}
                    if (parent.downloadViaEmail && !parent.formId) {
                      return 'Form ID is required'
                    }
                    return true
                  }),
              },
              {
                name: 'media',
                title: 'Media',
                description: 'Upload a file to be downloaded',
                validation: (rule: Rule) =>
                  rule.custom((_, context) => {
                    const parent = context.parent as {downloadViaEmail?: boolean; media?: any}
                    if (!parent.downloadViaEmail && !parent.media) {
                      return 'Upload a file to be downloaded'
                    }
                    return true
                  }),
                hidden: ({parent}: ConditionalPropertyCallbackContext) => parent.downloadViaEmail,
                type: 'file',
              },
              {
                name: 'downloadType',
                title: 'Download type',
                type: 'string',
                options: {
                  list: [
                    {title: 'Download file', value: 'download'},
                    {title: 'Open file in new tab', value: 'openInNewTab'},
                  ],
                  layout: 'radio',
                  direction: 'horizontal',
                },
                initialValue: 'openInNewTab',
                description:
                  'Decide whether you want to download the document to your device or open it in a new tab',
                hidden: ({parent}: ConditionalPropertyCallbackContext) => parent.downloadViaEmail,
              },
            ],
            preview: {
              select: {
                title: 'content.richText',
                media: 'image.image',
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
      prepare() {
        return {
          title: 'Download cards section',
        }
      },
    },
  }),
)

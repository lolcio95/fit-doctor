import {defineType, Rule} from 'sanity'
import {makeVisibleFieldValidator} from '../../../utils/misc'
import {blockContentPreview} from '../../../utils/blockContentPreview'

export const footerMenuItem = defineType({
  name: 'footerMenuItem',
  title: 'Menu Item',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required(),
        },
        {
          name: 'submenu',
          title: 'Submenu',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'type',
                  title: 'Type',
                  type: 'string',
                  initialValue: 'link',
                  options: {
                    list: [
                      {
                        title: 'Link',
                        value: 'link',
                      },
                      {
                        title: 'Text Content',
                        value: 'textContent',
                      },
                    ],
                    layout: 'radio',
                    direction: 'horizontal',
                  },
                },
                {
                  name: 'link',
                  title: 'Link',
                  type: 'labeledLink',
                  hidden: ({parent}) => !parent || parent.type !== 'link',
                  validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
                },
                {
                  name: 'textContent',
                  title: 'Text Content',
                  type: 'simpleRichText',
                  hidden: ({parent}) => !parent || parent.type !== 'textContent',
                  validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
                },
              ],
              preview: {
                select: {
                  label: 'link.label',
                  type: 'type',
                  textContent: 'textContent.richText',
                },
                prepare: ({label = 'Unlabeled', textContent, type}) => {
                  return {
                    title:
                      (!type && 'Unlabeled') ||
                      (type === 'link' && label) ||
                      blockContentPreview(textContent) ||
                      'Unlabeled',
                  }
                },
              },
            },
          ],
        },
      ],
    },
  ],
})

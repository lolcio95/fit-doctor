import {defineField, defineType, Rule, StringRule} from 'sanity'

import internalLink from './internalLink'
import externalLink, {externalLinkValidator} from './externalLink'
import mediaLink from './mediaLink'
import {makeVisibleFieldValidator} from '../../../utils/misc'
import sectionLink from './sectionLink'

const link = defineType({
  title: 'Link',
  name: 'link',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {
            title: 'Internal',
            value: internalLink.name,
          },
          {
            title: 'External',
            value: externalLink.name,
          },
          {
            title: 'Media',
            value: mediaLink.name,
          },
          {
            title: 'Section',
            value: sectionLink.name,
          },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      title: 'Resource',
      name: 'resource',
      type: 'internalLink',
      hidden: ({parent}) => !parent || parent.type !== internalLink.name,
      validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
    }),
    defineField({
      title: 'URL',
      name: 'url',
      type: 'externalUrl',
      hidden: ({parent}) => !parent || parent.type !== externalLink.name,
      validation: makeVisibleFieldValidator<Rule>((rule) =>
        rule.custom((value) => externalLinkValidator(value)).required(),
      ),
    }),
    defineField({
      title: 'Media',
      name: 'media',
      type: 'mediaLink',
      hidden: ({parent}) => !parent || parent.type !== mediaLink.name,
      validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
    }),
    defineField({
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
      description:
        'Decide whether you want to download the document to your device or open it in a new tab',
      hidden: ({parent}) => !parent || parent.type !== mediaLink.name,
      validation: makeVisibleFieldValidator<StringRule>((rule) => rule.required()),
    }),
    defineField({
      title: 'Section',
      name: 'section',
      type: 'sectionLink',
      hidden: ({parent}) => !parent || parent.type !== sectionLink.name,
      validation: makeVisibleFieldValidator<Rule>((Rule) => Rule.required()),
    }),
  ],
})

export default link

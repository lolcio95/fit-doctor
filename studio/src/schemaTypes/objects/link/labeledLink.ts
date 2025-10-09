import {defineField, StringRule} from 'sanity'

import {makeVisibleFieldValidator} from '../../../utils/misc'
import {getSchemaByType} from '../../../utils/document'
import link from './link'
import {extendModel} from '../../../utils/model'

export default extendModel(link, {
  title: 'Link with label',
  name: 'labeledLink',
  fields: [
    defineField({
      title: 'Label',
      name: 'label',
      type: 'string',
      validation: makeVisibleFieldValidator<StringRule>((rule) => rule.required()),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      link: 'link',
    },
    prepare: ({
      label = '',
      link,
    }: {
      label?: string
      link?: {
        type: any
      }
    }) => {
      const linkTypeTitle = getSchemaByType(link?.type)?.title

      return {
        title: label || 'Unlabeled',
        subtitle: linkTypeTitle || undefined,
      }
    },
  },
}, {
  arrayJoinOrder: 'sourceToDest'
})


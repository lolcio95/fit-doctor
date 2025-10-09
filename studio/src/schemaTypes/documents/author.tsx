import {UserIcon} from '@sanity/icons'
import {ConditionalPropertyCallbackContext, defineField, defineType, Rule} from 'sanity'
import {blockContentPreview} from '../../utils/blockContentPreview'
import { makeVisibleFieldValidator } from '../../utils/misc'

export const author = defineType({
  name: 'author',
  title: 'Author',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'simpleImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'paragraphWithDecoratorsRichText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'withButton',
      title: 'Include button?',
      initialValue: false,
      type: 'boolean',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'labeledLink',
      hidden: ({parent}: ConditionalPropertyCallbackContext) => !parent?.withButton,
      validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      subtitle: 'bio.richText',
      picture: 'picture.image',
    },
    prepare({name, subtitle, picture}) {
      return {
        title: name || "Author's name",
        subtitle: blockContentPreview(subtitle),
        media: picture,
      }
    },
  },
})

import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Advisor schema.  Define and edit the fields for the 'advisor' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const advisor = defineType({
  name: 'advisor',
  title: 'Advisor',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
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
      name: 'position',
      title: 'Position',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'richText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Text',
          type: 'string',
          validation: (rule) => rule.required(),
        },
        {
          name: 'calendlyUrl',
          title: 'Calendly URL',
          type: 'url',
          description:
            'Please provide a valid Calendly URL. It must start with https://calendly.com/',
          validation: (Rule) =>
            Rule.custom((value) => {
              if (value) {
                try {
                  const url = new URL(value as string)

                  if (url.protocol !== 'https:' && url.hostname !== 'calendly.com') {
                    return 'URL must start with https://calendly.com/'
                  }

                  if (!url.pathname || url.pathname === '/') {
                    return 'Invalid URL. Please provide a valid Calendly URL.'
                  }
                } catch {
                  // If the URL constructor throws, it's not a valid URL
                  return 'Invalid URL. Please provide a valid Calendly URL.'
                }
              }

              return true
            }),
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      picture: 'picture.image',
    },
    prepare({firstName, lastName, picture}) {
      const name = [firstName, lastName]
        .filter(Boolean)
        .join(' ')

      return {
        title: name || 'Advisor name',
        subtitle: 'Advisor',
        media: picture,
      }
    },
  },
})

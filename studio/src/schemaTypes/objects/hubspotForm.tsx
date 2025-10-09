import {defineType, defineField} from 'sanity'

export const hubspotForm = defineType({
  name: 'hubspotForm',
  title: 'HubSpot Form',
  type: 'object',
  fields: [
    defineField({
      name: 'formId',
      title: 'Form ID',
      type: 'string',
      description:
        'Add form ID as a reference to the form. Go to https://app-eu1.hubspot.com/forms/145940524/views/all_forms -> Actions -> Share -> Embed code, and copy formId',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      formId: 'formId',
    },
    prepare({formId}) {
      return {
        title: 'HubSpot Form',
        subtitle: formId,
      }
    },
  },
})

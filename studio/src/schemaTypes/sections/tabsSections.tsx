import {defineType} from 'sanity'
import {THUMBNAILS} from '../../consts/thumbnails'

export const tabsSections = defineType({
  name: 'tabsSections',
  title: 'Sections',
  type: 'array',
  of: [
    {type: 'listOfTwoColumns'},
    {type: 'twoColumns'},
    {type: 'faq'},
  ],
  options: {
    insertMenu: {
      // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
      views: [
        {
          name: 'grid',

          previewImageUrl: (schemaTypeName) => {
            return THUMBNAILS[schemaTypeName]
          },
        },
      ],
    },
  },
})

import {defineType} from 'sanity'
import {THUMBNAILS} from '../../../src/consts/thumbnails'

export const sections = defineType({
  name: 'sections',
  title: 'Sections',
  type: 'array',
  of: [
    {type: 'sectionRichText'},
    {type: 'mainHero'},
    {type: 'testimonials'},
    {type: 'bigImage'},
    {type: 'newsletter'},
    {type: 'listOfArticles'},
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

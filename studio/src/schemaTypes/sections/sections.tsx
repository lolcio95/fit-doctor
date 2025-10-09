import {defineType} from 'sanity'
import {THUMBNAILS} from '../../../src/consts/thumbnails'

export const sections = defineType({
  name: 'sections',
  title: 'Sections',
  type: 'array',
  of: [
    {type: 'twoColumns'},
    {type: 'tabs'},
    {type: 'sectionRichText'},
    {type: 'mainHero'},
    {type: 'secondaryHero'},
    {type: 'featuresWithImage'},
    {type: 'stats'},
    {type: 'featuresWithIcons'},
    {type: 'cta'},
    {type: 'logos'},
    {type: 'twoColumnsFeatures'},
    {type: 'ethos'},
    {type: 'featuresWithCards'},
    {type: 'testimonials'},
    {type: 'downloadCards'},
    {type: 'techPartnersCards'},
    {type: 'featuresWithLogos'},
    {type: 'contactForm'},
    {type: 'bigImage'},
    {type: 'teamCards'},
    {type: 'teamIcons'},
    {type: 'faq'},
    {type: 'iconHighlights'},
    {type: 'tableObject'},
    {type: 'newsletter'},
    {type: 'steps'},
    {type: 'contactTeam'},
    {type: 'listOfArticles'},
    {type: 'textColumnsGrid'},
    {type: 'tabbedList'},
    {type: 'whyUs'},
    {type: 'listOfTwoColumns'},
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

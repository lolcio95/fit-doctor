import {person} from './documents/person'
import {advisor} from './documents/advisor'
import {page} from './documents/page'
import { media } from './objects/media'
import { seo } from './objects/seo'
import { richText } from './objects/richText'
import { articleRichText } from './objects/richText/articleRichText'
import { simpleRichText } from './objects/richText/simpleRichText'
import { sectionRichText } from './objects/richText/sectionRichText'
import { paragraphWithDecoratorsRichText } from './objects/richText/paragraphWithDecoratorsRichText'
import { video } from './objects/video'
import { hubspotForm } from './objects/hubspotForm'
import { footerMenuItem } from './GlobalSettings/footer/footerMenuItem'
import { socialMedia } from './GlobalSettings/socialMedia/socialMedia'
import { header } from './GlobalSettings/header/header'
import { headerMenuItem } from './GlobalSettings/header/headerMenuItem'
import externalLink from './objects/link/externalLink'
import internalLink from './objects/link/internalLink'
import labeledLink from './objects/link/labeledLink'
import mediaLink from './objects/link/mediaLink'
import sectionLink from './objects/link/sectionLink'
import link from './objects/link/link'
import { twoColumns } from './sections/twoColumns'
import { tabs } from './sections/tabs'
import { tab } from './objects/tab'
import { sections } from './sections/sections'
import { tabsSections } from './sections/tabsSections'
import { testimonials } from './sections/testimonials'
import { mainHero } from './sections/mainHero'
import { featuresWithImage } from './sections/featuresWithImage'
import { simpleImage } from './objects/simpleImage'
import { stats } from './sections/stats'
import { featuresWithIcons } from './sections/featuresWithIcons'
import { cta } from './sections/cta'
import { logos } from './sections/logos'
import { twoColumnsFeatures } from './sections/twoColumnsFeatures'
import { ethos } from './sections/ethos'
import { secondaryHero } from './sections/secondaryHero'
import { steps } from './sections/steps'
import { featuresWithCards } from './sections/featuresWithCards'
import { downloadCards } from './sections/downloadCardsSection'
import { contactTeam } from './sections/contactTeam'
import { techPartnersCards } from './sections/techPartnersCards'
import { featuresWithLogos } from './sections/featuresWithLogos'
import { contactForm } from './sections/contactForm'
import { bigImage } from './sections/bigImage'
import { teamCards } from './sections/teamCards'
import { teamIcons } from './sections/teamIcons'
import { faq } from './sections/faq'
import { iconHighlights } from './sections/iconHighlights'
import { table } from './sections/table'
import { articleCategory } from './documents/articleCategory'
import { newsletter } from './sections/newsletter'
import { author } from './documents/author'
import { article } from './documents/article'
import { footer } from './GlobalSettings/footer/footer'
import { listOfArticles } from './sections/listOfArticles'
import { textColumnsGrid } from './sections/textColumnsGrid'
import { tabbedList } from './sections/tabbedList'
import { articlesSettings } from './GlobalSettings/articleSettings/articleSettings'
import { whyUs } from './sections/whyUs'
import { listOfTwoColumns } from './sections/listOfTwoColumns'
import { seoSettings } from './GlobalSettings/SEO/seoSettings'
import { redirects } from './GlobalSettings/redirects/redirects'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Documents
  page,
  person,
  advisor,
  articleCategory,
  author,
  article,
  // Objects
  externalLink,
  internalLink,
  mediaLink,
  sectionLink,
  labeledLink,
  link,
  seo,
  richText,
  articleRichText,
  simpleRichText,
  sectionRichText,
  paragraphWithDecoratorsRichText,
  video,
  hubspotForm,
  media,
  tab,
  simpleImage,
  //Footer
  footer,
  footerMenuItem,
  socialMedia,
  //Header
  header,
  headerMenuItem,
  //global settings
  articlesSettings,
  seoSettings,
  redirects,
  //Sections
  sections,
  tabsSections,
  twoColumns,
  tabs,
  mainHero,
  featuresWithImage,
  stats,
  featuresWithIcons,
  cta,
  logos,
  twoColumnsFeatures,
  ethos,
  secondaryHero,
  steps,
  featuresWithCards,
  testimonials,
  downloadCards,
  contactTeam,
  techPartnersCards,
  featuresWithLogos,
  contactForm,
  bigImage,
  teamCards,
  teamIcons,
  faq,
  iconHighlights,
  table,
  newsletter,
  listOfArticles,
  textColumnsGrid,
  tabbedList,
  whyUs,
  listOfTwoColumns,
]

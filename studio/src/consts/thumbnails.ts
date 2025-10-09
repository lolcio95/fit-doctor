import mainHero from '../../static/page-builder-thumbnails/mainHero.png'
import secondaryHero from '../../static/page-builder-thumbnails/secondaryHero.png'
import cta from '../../static/page-builder-thumbnails/cta.png'
import twoColumns from '../../static/page-builder-thumbnails/twoColumns.png'
import tabs from '../../static/page-builder-thumbnails/tabs.png'
import richText from '../../static/page-builder-thumbnails/richText.png'
import featuresWithImage from '../../static/page-builder-thumbnails/featuresWithImage.png'
import stats from '../../static/page-builder-thumbnails/stats.png'
import featuresWithIcons from '../../static/page-builder-thumbnails/featuresWithIcons.png'
import logos from '../../static/page-builder-thumbnails/logos.png'
import twoColumnsFeatures from '../../static/page-builder-thumbnails/twoColumnsFeatures.png'
import ethos from '../../static/page-builder-thumbnails/ethos.png'
import featuresWithCards from '../../static/page-builder-thumbnails/featuresWithCards.png'
import testimonials from '../../static/page-builder-thumbnails/testimonials.png'
import downloadCards from '../../static/page-builder-thumbnails/downloadCards.png'
import techPartnersCards from '../../static/page-builder-thumbnails/techPartnersCards.png'
import featuresWithLogos from '../../static/page-builder-thumbnails/featuresWithLogos.png'
import contactForm from '../../static/page-builder-thumbnails/contactForm.png'
import bigImage from '../../static/page-builder-thumbnails/bigImage.png'
import teamCards from '../../static/page-builder-thumbnails/teamCards.png'
import teamIcons from '../../static/page-builder-thumbnails/teamIcons.png'
import faq from '../../static/page-builder-thumbnails/faq.png'
import iconHighlights from '../../static/page-builder-thumbnails/iconHighlights.png'
import tableObject from '../../static/page-builder-thumbnails/tableObject.png'
import newsletter from '../../static/page-builder-thumbnails/newsletter.png'
import steps from '../../static/page-builder-thumbnails/steps.png'
import contactTeam from '../../static/page-builder-thumbnails/contactTeam.png'
import listOfArticles from '../../static/page-builder-thumbnails/listOfArticles.png'
import textColumnsGrid from '../../static/page-builder-thumbnails/textColumnsGrid.png'
import tabbedList from '../../static/page-builder-thumbnails/tabbedList.png'
import whyUs from '../../static/page-builder-thumbnails/whyUs.png'
import listOfTwoColumns from '../../static/page-builder-thumbnails/listOfTwoColumns.png'

const getSrc = (image: string | { src: string }) => {
  return typeof image === 'string' ? image : image.src
}

export const THUMBNAILS: Record<string, string> = {
  twoColumns: getSrc(twoColumns),
  tabs: getSrc(tabs),
  sectionRichText: getSrc(richText),
  mainHero: getSrc(mainHero),
  secondaryHero: getSrc(secondaryHero),
  featuresWithImage: getSrc(featuresWithImage),
  stats: getSrc(stats),
  featuresWithIcons: getSrc(featuresWithIcons),
  cta: getSrc(cta),
  logos: getSrc(logos),
  twoColumnsFeatures: getSrc(twoColumnsFeatures),
  ethos: getSrc(ethos),
  featuresWithCards: getSrc(featuresWithCards),
  testimonials: getSrc(testimonials),
  downloadCards: getSrc(downloadCards),
  techPartnersCards: getSrc(techPartnersCards),
  featuresWithLogos: getSrc(featuresWithLogos),
  contactForm: getSrc(contactForm),
  bigImage: getSrc(bigImage),
  teamCards: getSrc(teamCards),
  teamIcons: getSrc(teamIcons),
  faq: getSrc(faq),
  iconHighlights: getSrc(iconHighlights),
  tableObject: getSrc(tableObject),
  newsletter: getSrc(newsletter),
  steps: getSrc(steps),
  contactTeam: getSrc(contactTeam),
  listOfArticles: getSrc(listOfArticles),
  textColumnsGrid: getSrc(textColumnsGrid),
  tabbedList: getSrc(tabbedList),
  whyUs: getSrc(whyUs),
  listOfTwoColumns: getSrc(listOfTwoColumns),
}

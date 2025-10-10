import { PER_PAGE } from "@/app/api/articles/consts";
import { defineQuery } from "next-sanity";

export const makeImageFragment = (field: string) => `
  ${field} {
    _type,
    asset -> {
      url,
      metadata {
        lqip,
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  }
`;

export const makeMediaImageFragment = (field: string) => `
  ${field} {
    _type,
    altText,
    ${makeImageFragment("mobileImage")},
    ${makeImageFragment("desktopImage")},
  }
`;

const link = `
  resource -> {
    "slug": slug.current
  },
  mediaLink {
    asset -> {
      url,
      originalFilename,
    }
  },
  section {
    ...,
    sectionKey,
    page -> {
      "slug": slug.current
    }
  }
`;

export const makeRichTextFragment = (field: string) => `
  ${field} {
    ...,
    richText [] {
      ...,
      ${makeImageFragment("image")},
      markDefs [] {
        ...,
        ${link},
      }
    }
  }
`;

export const homePageQuery = defineQuery(`
  *[_type == 'homePage'] [0] {
    _id,
    _type,
    sections [] {
      ...
    },
  }
`);

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const mainHeroSection = `
  _type == "mainHero" => {
    ...,
    ${makeRichTextFragment("title")},
    ${makeRichTextFragment("description")},
    ${makeMediaImageFragment("image")},
    buttons[] {
      ...,
      link {
        ...,
        ${link},
      }
    }
  }
`;

const ctaSection = `
  _type == "cta" => {
    ...,
    button {
      ...,
      ${link},
    },
    ${makeRichTextFragment("text")}
  }
`;

const ethosSection = `
  _type == "ethos" => {
    ...,
    button {
      ...,
      ${link},
    },
    ${makeRichTextFragment("content")},
    person -> {
      ...,
      picture {
       ...,
       ${makeImageFragment("image")},
      },
    }
  }
`;

const featuresWithCardsSection = `
  _type == "featuresWithCards" => {
    ...,
    ${makeRichTextFragment("title")},
    cards [] {
      ...,
      icon {
        ...,
        ${makeImageFragment("image")},
      },
      ${makeRichTextFragment("content")},
    },
    button {
      ...,
      ${link},
    }
  }
`;

const secondaryHero = `
  _type == "secondaryHero" => {
    ...,
    ${makeRichTextFragment("title")},
    logo {
      ...,
      ${makeImageFragment("image")},
    },
    button {
      ...,
      ${link},
    },
  }
`;

const downloadCardsSection = `
  _type == "downloadCards" => {
    ...,
    cards[] {
      ...,
      ${makeRichTextFragment("content")},
      image {
        ...,
        ${makeImageFragment("image")},
      },
      media {
        asset -> {
          url,
          originalFilename,
        }
      }
    }
  }
`;

const testimonialsSection = `
  _type == "testimonials" => {
    ...,
    testimonials[] {
      ...,
      ${makeRichTextFragment("content")},
      person -> {
        ...,
        picture {
          ...,
          ${makeImageFragment("image")},
        },
      },
    }
  }
`;

const techPartnersCardsSection = `
  _type == "techPartnersCards" => {
    ...,
    ${makeRichTextFragment("title")},
    cards[] {
      ...,
      link {
        ...,
        ${link},
      },
      image {
        ...,
        ${makeImageFragment("image")},
      },
    }
  }
`;

const featuresWithLogos = `
  _type == "featuresWithLogos" => {
    ...,
    ${makeRichTextFragment("title")},
    features[] {
      ...,
      link {
        ...,
        ${link},
      },
      ${makeRichTextFragment("content")},
    },
    logos[] {
      ...,
      ${makeImageFragment("image")},
    }
  }
`;

const featuresWithIcons = `
  _type == "featuresWithIcons" => {
    ...,
    ${makeRichTextFragment("title")},
    cards[] {
      ...,
      icon {
        ...,
        ${makeImageFragment("image")},
      },
      ${makeRichTextFragment("content")},
    }
  }
`;

const featuresWithImage = `
  _type == "featuresWithImage" => {
    ...,
    ${makeRichTextFragment("title")},
    ${makeMediaImageFragment("image")},
    cards[] {
      ...,
      icon {
        ...,
        ${makeImageFragment("image")},
      },
      ${makeRichTextFragment("content")},
    }
  }
`;

const teamsCardsSection = `
  _type == "teamCards" => {
    ...,
    ${makeRichTextFragment("title")},
    cards[] {
      ...,
      person -> {
        ...
      },
    }
  }
`;

const contactTeam = `
  _type == "contactTeam" => {
    ...,
    ${makeRichTextFragment("title")},
    advisors[] {
      ...,
      advisor -> {
        ...,
        picture {
          ...,
          ${makeImageFragment("image")},
        },
        ${makeRichTextFragment("bio")}
      },
    }
  }
`;

const contactForm = `
  _type == "contactForm" => {
    ...,
    ${makeRichTextFragment("content")}
  }
`;

const teamIconsSection = `
  _type == "teamIcons" => {
    ...,
    ${makeRichTextFragment("title")},
    button {
      ...,
      ${link},
    },
    teamIcons[] {
      ...,
      person -> {
        ...,
        picture {
          ...,
          ${makeImageFragment("image")},
        },
      },
    }
  }
`;

const logosSection = `
  _type == "logos" => {
    ...,
    ${makeRichTextFragment("title")},
    button {
      ...,
      ${link},
    },
    logos[] {
      ...,
      ${makeImageFragment("image")},
    }
  }
`;

const articlesInfo = `
    "categories": *[_type == "articleCategory"]{
      categoryName
    },
    "articlesMetadata": {
      "total": count(*[_type == "article"]),
      "categories": *[_type == "articleCategory"]{
        categoryName,
        "count": count(*[_type == "article" && references(^._id)])
      }
    }
`;

const iconHighlightsSection = `
  _type == "iconHighlights" => {
    ...,
    ${makeRichTextFragment("title")},
    highlights[] {
      ...,
      icon {
        ...,
        ${makeImageFragment("image")},
      },
      ${makeRichTextFragment("description")},
    }
  }
`;

const twoColumnsSection = `
  _type == "twoColumns" => {
    ...,
    ${makeRichTextFragment("text")},
    ${makeMediaImageFragment("image")},
  }
`;

const textColumnsGridSection = `
  _type == "textColumnsGrid" => {
    ...,
    ${makeRichTextFragment("title")},
  }
`;

const bigImageSection = `
  _type == "bigImage" => {
    ...,
    ${makeMediaImageFragment("image")},
  }
`;

const tabbedListSection = `
  _type == "tabbedList" => {
    ...,
    tabs [] {
      ...,
      tabIcon {
        ...,
        ${makeImageFragment("image")},
      }
    }
  }
`;

const whyUsSection = `
  _type == "whyUs" => {
    ...,
    image {
      ...,
      ${makeImageFragment("image")},
    },
    ${makeRichTextFragment("content")}
  }
`;

const faqSection = `
  _type == "faq" => {
    ...,
    ${makeRichTextFragment("content")},
    groups [] {
      ...,
      items [] {
        ...,
        ${makeRichTextFragment("answer")}
      }
    }
  }
`;

const newsletterSection = `
  _type == "newsletter" => {
    ...,
    ${makeRichTextFragment("content")},
  }
`;

const statsSection = `
  _type == "stats" => {
    ...,
    ${makeRichTextFragment("title")},
  }
`;

const stepsSection = `
  _type == "steps" => {
    ...,
    ${makeRichTextFragment("title")},
    items [] {
      ...,
      ${makeRichTextFragment("description")},
    }
  }
`;

const twoColumnsFeaturesSection = `
  _type == "twoColumnsFeatures" => {
    ...,
    ${makeRichTextFragment("title")},
    ${makeRichTextFragment("leftColumn")},
    ${makeRichTextFragment("rightColumn")},

  }
`;

const listOfArticlesSection = `
  _type == "listOfArticles" => {
    ...,
    allArticlesButton {
      ...,
      ${link},
    },
    customArticles[] -> {
      ...,
      ${makeMediaImageFragment("coverImage")},
      category-> {
        ...
      }
    },
    ${articlesInfo},
    "initialArticles": *[_type == "article"] | order(date desc)[0...${PER_PAGE}]{
      ...,
      ${makeMediaImageFragment("coverImage")},
      category-> {
        ...
      },
    },
  }
`;

export const articleRichText = `
 _type == "articleRichText" => {
    ...,
    richText [] {
      ...,
      ${makeImageFragment("image")},
      markDefs [] {
        ...,
        ${link},
      }
    }
  }
`;

export const sectionRichText = `
 _type == "sectionRichText" => {
    ...,
    richText [] {
      ...,
      ${makeImageFragment("image")},
      markDefs [] {
        ...,
        ${link},
      }
    }
  }
`;

export const richText = `
 _type == "richText" => {
    ...,
    richText [] {
      ...,
      ${makeImageFragment("image")},
      markDefs [] {
        ...,
        ${link},
      }
    }
  }
`;

const listOfTwoColumnsSection = `
  _type == "listOfTwoColumns" => {
    ...,
    ${makeRichTextFragment("title")},
    list[] {
      ...,
      ${makeRichTextFragment("text")},
      button {
        ...,
        ${link},
      },
      ${makeMediaImageFragment("image")},
    }
  }
`;

const customSections = `
    ${mainHeroSection},
    ${ctaSection},
    ${ethosSection},
    ${featuresWithCardsSection},
    ${secondaryHero},
    ${testimonialsSection},
    ${downloadCardsSection},
    ${techPartnersCardsSection},
    ${featuresWithLogos},
    ${featuresWithIcons},
    ${featuresWithImage},
    ${teamsCardsSection},
    ${contactTeam},
    ${teamIconsSection},
    ${logosSection},
    ${listOfArticlesSection},
    ${twoColumnsSection},
    ${tabbedListSection},
    ${bigImageSection},
    ${iconHighlightsSection},
    ${articleRichText},
    ${sectionRichText},
    ${richText},
    ${whyUsSection},
    ${contactForm},
    ${faqSection},
    ${newsletterSection},
    ${statsSection},
    ${stepsSection},
    ${textColumnsGridSection},
    ${twoColumnsFeaturesSection},
    ${listOfTwoColumnsSection},
`;

const tabsSection = `
  _type == "tabs" => {
    ...,
    tabs [] {
      ...,
      tabsSections [] {
        ...,
        ${twoColumnsSection},
        ${faqSection},
        ${listOfTwoColumnsSection},
      }
    }
  }
`;

export const getNavbarQuery = defineQuery(`
  *[_type == "header"][0] {
    ...,
    logo {
      ...,
      ${makeImageFragment("image")},
    },
    buttons[] {
      ...,
      link {
        ...,
        ${link},
      }
    },
    menuItems[] {
      ...,
      link {
        ...,
        ${link},
      },
      submenu[] {
        ...,
        link {
          ...,
          ${link},
        },
      }
    }
  }
`);

export const getNavbar = defineQuery(`
  *[_type == "navbar"][0] {
    ...,
    logo {
      ...,
      ${makeImageFragment("image")},
    },
    menuItems[] {
      ...,
      ${link},
    }
  }
`)

export const getFooterQuery = defineQuery(`
  *[_type == "footer"][0] {
    ...,
    logo {
      ...,
      ${makeImageFragment("image")},
    },
    footerMenuItems[] {
      ...,
      submenu[] {
        ...,
        link {
          ...,
          ${link},
        },
      }
    },
    references[] {
        ...,
        link {
          ...,
          ${link},
        },
    },
    socials[] -> {
      name,
      image {
        ...,
        ${makeImageFragment("image")},
      },
      socialsUrl,
    }
  }
`);

export const seoGlobal = `
  *[_type == "seoSettings"][0] {
    ...,
  }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    title,
    slug,
    heading,
    subheading,
    sections [] {
      ...,
      ${customSections}
      ${tabsSection}
    },
    seo,
  }

`);

export const sitemapData = defineQuery(`
  *[(_type == "page" || _type == "article") && seo.noIndex != true && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt
  }
`);

const articleSections = `
  newsletter {
    ...
  },
  listOfArticles {
    ...,
    allArticlesButton {
      ...,
      ${link},
    },
    customArticles[] -> {
      ...,
      ${makeMediaImageFragment("coverImage")},
      category-> {
        ...
      }
    },
    ${articlesInfo},
    "initialArticles": *[_type == "article"] | order(date desc)[0...4]{
      ...,
      ${makeMediaImageFragment("coverImage")},
      category-> {
        ...
      }
    }
  },
  cta {
    ...,
    button {
      ...,
      ${link},
    }
  },
`;

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug] [0] {
    _id,
    _type,
    title,
    ${makeMediaImageFragment("coverImage")},
    ${makeRichTextFragment("content")},
    sections[] {
      ...,
      ${customSections}
      ${tabsSection}
    },
    date,
    seo,
    author -> {
      ...,
      picture {
        ...,
        ${makeImageFragment("image")},
      },
      button {
        ...,
        ${link},
      },
      ${makeRichTextFragment("bio")}
    },
    category -> {
      ...
    },
    withListOfArticles,
    withCta,
    withNewsletter,
    ${articleSections}
    "defaultArticleSectionsData": *[_type == "articlesSettings"][0] {
      ${articleSections}
    }
  }
`);

export const getRecentArticlesQuery = defineQuery(`
  *[_type == "article" && (!defined($categoryName) || category->categoryName == $categoryName)] | order(date desc)[0...4] {
    ...,
    ${makeMediaImageFragment("coverImage")},
    category-> {
      ...
    }
  }
`);

export const getAllArticlesQuery = defineQuery(`
  *[_type == "article" && (!defined($categoryName) || category->categoryName == $categoryName)] | order(date desc)[$pageStart...$pageEnd] {
    ...,
    ${makeMediaImageFragment("coverImage")},
    category-> {
      ...
    }
  }
`);

export const getArticleCategories = defineQuery(`
  *[_type == "articleCategory"] {
    ...,
  }
`);

export const articlePagesSlugs = defineQuery(`
  *[_type == "article" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

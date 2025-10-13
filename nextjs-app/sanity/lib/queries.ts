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
    ${makeMediaImageFragment("image")},
    button {
      ...,
      ${link},
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


const bigImageSection = `
  _type == "bigImage" => {
    ...,
    ${makeMediaImageFragment("image")},
  }
`;

const newsletterSection = `
  _type == "newsletter" => {
    ...,
    ${makeRichTextFragment("content")},
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

export const whyUs = `
 _type == "whyUs" => {
  ...,
  whyUs[] {
      ...,
      image {
        ...,
        ${makeImageFragment("image")},
      },
    }
}
`;


export const gallery = `
 _type == "gallery" => {
  ...,
  gallery[] {
    ...,
    ${makeImageFragment("image")},

  }
}
`;


const customSections = `
    ${mainHeroSection},
    ${testimonialsSection},
    ${listOfArticlesSection},
    ${bigImageSection},
    ${articleRichText},
    ${sectionRichText},
    ${richText},
    ${newsletterSection},
    ${whyUs},
    ${gallery},
`;

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

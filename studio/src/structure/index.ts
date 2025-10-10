import {CogIcon, SelectIcon, DocumentTextIcon, UserIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const DISABLED_TYPES = ['header', 'footer', 'socialMedia', 'articlesSettings', 'seoSettings', 'redirects', 'assist.instruction.context', 'media.tag', 'article', 'articleCategory', 'author']
export const GLOBAL_SETTINGS_TYPES = ['header', 'footer', 'socialMedia', 'articlesSettings', 'seoSettings', 'redirects']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      ...S.documentTypeListItems()
        // Remove the "assist.instruction.context" and "settings" content  from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Pluralize the title of each document type.  This is not required but just an option to consider.
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),

      S.divider(),
      S.listItem()
      .title('Articles')
      .child(S.documentTypeList('article')).icon(DocumentTextIcon),
      S.listItem()
      .title('Article Authors')
      .child(S.documentTypeList('author')).icon(UserIcon),
      S.listItem()
        .title('Article Categories')
        .child(S.documentTypeList('articleCategory')).icon(SelectIcon),
      S.divider(),

      S.listItem()
        .title('Global Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('General Settings')
            .items([
              S.listItem()
              .title('Social Media')
              .schemaType('socialMedia')
              .child(
                S.documentTypeList('socialMedia')
                  .title('Social Media')
              ),
              S.documentListItem()
                .title('Footer')
                .schemaType('footer')
                .child(S.document().schemaType('footer').documentId('footer')),
              S.documentListItem()
                .title('Header')
                .schemaType('header')
                .child(S.document().schemaType('header').documentId('header')),
              S.documentListItem()
                .title('Navbar')
                .schemaType('navbar')
                .child(S.document().schemaType('navbar').documentId('navbar')),
              S.documentListItem()
                .title('Articles Settings')
                .schemaType('articlesSettings')
                .child(S.document().schemaType('articlesSettings').documentId('articlesSettings')),
              S.documentListItem()
                .title('SEO Settings')
                .schemaType('seoSettings')
                .child(S.document().schemaType('seoSettings').documentId('seoSettings')),
              S.documentListItem()
                .title('Redirects')
                .schemaType('redirects')
                .child(S.document().schemaType('redirects').documentId('redirects')),
            ])
        ),
    ])

/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import { vercelDeployTool } from "sanity-plugin-vercel-deploy"
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {media} from 'sanity-plugin-media'
import {simplerColorInput} from 'sanity-plugin-simpler-color-input'
import {table} from '@sanity/table'
import {resolveDocumentActions} from './src/documentActions'
import {newDocumentOptionsResolver} from './src/utils/studio'
import { LogoComponent } from './src/components/LogoComponent'

// Environment variables for project configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-projectID'
const dataset = process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'article':
      return slug ? `/insights-articles/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'FitDoctor',
  icon: LogoComponent,

  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/insights-articles/:slug',
            filter: `_type == "article" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          article: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('article', doc?.slug)!,
                },
                {
                  title: 'Home',
                  href: '/',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
    media({
      creditLine: {
        enabled: false,
      },
      maximumUploadSize: 10000000,
      // number - maximum file size (in bytes) that can be uploaded through the plugin interface
    }),
    simplerColorInput({
      // Note: These are all optional
      defaultColorFormat: 'rgba',
      defaultColorList: [
        {label: 'White', value: '#ffffff'},
        {label: 'Foreground', value: '#0B446F'},
        {label: 'Muted Foreground', value: '#055186'},
        {label: 'Secondary Foreground', value: '#B9E2FE'},
        {label: 'Custom...', value: 'custom'},
      ],
      enableSearch: true,
    }),
    table(),
    vercelDeployTool()
  ],
  document: {
    newDocumentOptions: newDocumentOptionsResolver,
    actions: resolveDocumentActions,
  },
  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})

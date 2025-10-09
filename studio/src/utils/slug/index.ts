import {SlugOptions, SlugRule, SlugValidationContext} from 'sanity'
import _slugify from 'slugify'
import urlJoin from 'url-join'
import {MakePrefixedPageSlugOptionsParams} from './types'

export const slugValidator = (Rule: SlugRule, customRegex?: RegExp) =>
  Rule.required().custom((slug) => {
    if (typeof slug === 'undefined') return true
    const regex = customRegex ?? /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/
    if (slug.current && regex.test(slug.current)) {
      return true
    } else {
      return 'Invalid slug: Only numbers, lowercase letters, and dashes are permitted.'
    }
  })

export const isSlugUnique = async (slug: string, context: SlugValidationContext) => {
  const query = `*[slug.current == $slug]`

  const documents: {_id: string}[] = await context
    .getClient({apiVersion: '2024-05-28'})
    .fetch(query, {
      slug,
    })

  const validDocuments = documents.filter(
    (item) =>
      !item._id.startsWith('drafts.') && (!context.document || item._id !== context.document._id),
  )
  const isDraft = context.document?._id.startsWith('drafts.')
  const hasDraftUniqueSlug = validDocuments.some(
    (document) => document._id === context.document?._id.replace('drafts.', ''),
  )

  return (
    (isDraft && validDocuments.length === 0) ||
    (!isDraft && validDocuments.length <= 1) ||
    hasDraftUniqueSlug
  )
}

export const slugify = (
  input: string,
  options?: Omit<Parameters<typeof _slugify>[1], 'string'>,
): string =>
  _slugify(input, {
    lower: true,
    strict: true,
    ...(options || {}),
  })

const removeTrailingSlash = (path: string): string =>
  path.endsWith('/') ? path.slice(0, path.length - 1) : path

export const defaultSlugifier = (input: string) => removeTrailingSlash(`/${slugify(input)}`)

export const makePrefixedPageSlugOptions = ({
  prefix,
  ...options
}: MakePrefixedPageSlugOptionsParams): SlugOptions => ({
  ...options,
  slugify: options.slugify || ((source) => source),
  source: async (document) => {
    const title = typeof document.title === 'string' ? document.title : ''

    return urlJoin(prefix, defaultSlugifier(title))
  },
})

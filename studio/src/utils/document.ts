import {Schema, Reference, prepareForPreview, SanityDocument} from 'sanity'
import {client} from './client'

import groq from 'groq'

export const getSchemaByType = (schema: Schema, documentType?: string) => {
  if (!documentType) {
    return undefined
  }

  return schema.get(documentType)
}

export const resolveReference = async <T>(
  ref: Reference,
  selection?: string,
): Promise<T | null> => {
  const {_ref} = ref ?? {}

  if (!_ref) {
    return null
  }

  const result = await client.fetch(
    groq`*[_id == "${_ref}"] ${selection ? `{ ${selection} }` : ''}`,
  )

  if (!result) {
    return null
  }

  const [document] = result

  return document
}

import {sections as sectionsModel} from '../schemaTypes/sections/sections'

const MAX_SUBTITLE_LENGTH = 120

export const getDocumentSections = (document: SanityDocument, schemaArg: Schema) => {
  const {[sectionsModel.name]: sections = []} = document ?? {}

  if (!Array.isArray(sections)) {
    return []
  }

  return sections.map((section) => {
    const {_key, _type} = section

    const schema = getSchemaByType(schemaArg, _type)

    if (!schema) {
      return {
        title: `Unknown section type: ${_type}`,
        value: _key,
      }
    }

    const previewResult = prepareForPreview(section, schema)

    const {title: schemaTitle = schema.name} = schema ?? {}

    if (!previewResult?.subtitle) {
      return {
        title: schemaTitle,
        value: _key,
      }
    }

    const subtitle = `(${previewResult.subtitle.substring(0, MAX_SUBTITLE_LENGTH)}${
      previewResult.subtitle.length > MAX_SUBTITLE_LENGTH ? '...' : ''
    })`

    return {
      title: `${previewResult?.title || schemaTitle} ${subtitle}`,
      value: _key,
    }
  })
}

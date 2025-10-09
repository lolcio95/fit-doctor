import {
  DocumentOptions,
  IntrinsicDefinitions,
  NewDocumentOptionsResolver,
  SchemaType,
  SchemaTypeDefinition,
  TemplateItem,
} from 'sanity'
import {TriggerVercelDeployResponse} from '../types'
import {client} from './client'
import groq from 'groq'
import {getSchemaByType} from './document'

export const makeSanityClient = (config = {}) =>
  client.withConfig({
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    ...config,
  })

export const triggerVercelBuild = async () => {
  const result = await makeSanityClient().fetch<TriggerVercelDeployResponse[]>(
    groq`*[_type == "webhook_deploy"]`,
  )

  if (!(result?.length ?? 0)) {
    if (process.env.NODE_ENV !== 'production') {
      return
    }
    throw new Error('Missing deployment hook')
  }

  await Promise.all(result.map((target) => fetch(target?.url, {method: 'POST'})))
}

export const triggerDeployment = async () => {
  await triggerVercelBuild()
}

export const getDocumentOptions = (
  documentType:
    | IntrinsicDefinitions[keyof IntrinsicDefinitions]
    | SchemaType
    | SchemaTypeDefinition
    | undefined,
): DocumentOptions | undefined => documentType?.options as DocumentOptions | undefined

export const newDocumentOptionsResolver: NewDocumentOptionsResolver = (items, context) => {
  const {
    schema,
    creationContext: {schemaType},
  } = context

  return items.reduce<TemplateItem[]>((acc, item) => {
    // TemplateId for default item creation is the same as schemaType
    const documentSchemaType = getSchemaByType(schema, item.templateId)

    if (!documentSchemaType) {
      throw new Error(`Document schema type not found for ${schemaType}`)
    }

    const documentOptions = getDocumentOptions(documentSchemaType)

    if (!documentOptions) {
      acc.push(item)

      return acc
    }

    if (typeof documentOptions.creatable === 'boolean' && !documentOptions.creatable) {
      return acc
    }

    acc.push(item)

    return acc
  }, [])
}

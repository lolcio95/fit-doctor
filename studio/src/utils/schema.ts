import {SchemaType} from 'sanity'

export const hasFieldsInSchema = <T extends SchemaType | undefined>(
  schema: T,
): schema is T & {
  fields: Extract<SchemaType, {fields: unknown}>['fields']
} => schema && 'fields' in schema && Array.isArray(schema.fields)

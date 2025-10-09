import {
  CustomValidatorResult,
  FieldDefinition,
  isKeyedObject,
  isKeySegment,
  KeyedSegment,
  Path,
  PathSegment,
  RuleBuilder,
  RuleDef,
  Schema,
  ValidationContext,
  ValidationMarker,
} from 'sanity'
import {isStringIndexable} from './typeGuards'

const getSegmentField = (
  acc: {
    object: unknown
    path: string | number | Path | KeyedSegment
  },
  segment: PathSegment,
  fields: FieldDefinition[],
): unknown | undefined => {
  /**
   * If the segment is a string, then it's a field,
   * if not, then it's an object with _key inside,
   * which means that acc.object is an array
   */

  if (typeof segment === 'string') {
    return fields.find((field) => field.name === segment)
  }

  if (Array.isArray(acc.object) && isKeySegment(segment)) {
    return acc.object.find((item) => item._key === segment._key)
  }

  throw new Error('Should never get here, you need to investigate')
}

const getFieldType = (field: unknown): string => {
  if (!field || typeof field !== 'object') {
    throw new Error('Field is not an object')
  }

  if ('type' in field && typeof field.type === 'string') {
    return field.type
  }

  if ('_type' in field && typeof field._type === 'string') {
    return field._type
  }

  throw new Error('Field type not found')
}

const getNewPath = (
  value: unknown,
  {
    path,
    segment,
    jsonType,
  }: {
    path: string | number | Path | KeyedSegment
    segment: PathSegment
    jsonType: string
  },
) => {
  const nextSegment = (() => {
    switch (jsonType) {
      case 'object':
        return segment
      case 'array':
        if (isKeyedObject(segment)) {
          return {_key: segment._key}
        }

        return Array.isArray(value) ? value.indexOf(segment) : undefined
      default:
        return undefined
    }
  })()

  if (!nextSegment) {
    return path
  }

  return Array.isArray(path) && path.length <= 0
    ? segment
    : [...(Array.isArray(path) ? path : [path]), nextSegment]
}

const isAnyOfAncestorsHidden = (fieldContext: ValidationContext) => {
  let isHidden = false

  // TODO: Make it work with the global getSchemaByType util,
  // example: add a decor with empty link in richText
  // eslint-disable-next-line no-underscore-dangle
  const _getSchemaByType = (schema: Schema, documentType: string | undefined) => {
    if (!documentType) {
      return undefined
    }

    // eslint-disable-next-line no-underscore-dangle
    return schema._original?.types.find((schemaType) => schemaType.name === documentType)
  }

  fieldContext.path?.reduce<{
    object: unknown | undefined
    path: string | number | Path | KeyedSegment
  }>(
    (acc, segment, index) => {
      // We don't need to check further
      if (isHidden) {
        return acc
      }

      const parentSchemaType = !Array.isArray(acc.object)
        ? _getSchemaByType(
            fieldContext.schema,
            typeof acc.object === 'object' &&
              acc.object &&
              '_type' in acc.object &&
              typeof acc.object._type === 'string'
              ? acc.object._type
              : undefined,
          )
        : (() => {
            /* If acc.object is an array, then it doesn't have a type property,
                 but we can still get it from context */
            if (typeof segment === 'string' || !segment) {
              return undefined
            }

            const parentType = fieldContext?.path?.[index - 1]

            return parentType
              ? _getSchemaByType(fieldContext.schema, String(parentType))
              : undefined
          })()

      if (!parentSchemaType) {
        return acc
      }

      const {fields = []} = 'fields' in parentSchemaType ? parentSchemaType : {fields: []}

      const segmentField = getSegmentField(acc, segment, fields)

      if (!segmentField) {
        return acc
      }

      const object: unknown = (() => {
        if (typeof segment === 'string') {
          return isStringIndexable(acc.object) ? acc.object[segment] : undefined
        }

        if (Array.isArray(acc.object) && isKeySegment(segment)) {
          return acc.object.find((item) => item._key === segment._key)
        }

        return acc
      })()

      const {hidden} =
        typeof segmentField === 'object' && 'hidden' in segmentField
          ? segmentField
          : {hidden: false}

      const segmentSchemaType = fieldContext.schema.get(getFieldType(segmentField))

      const newPath = getNewPath(object, {
        path: acc.path,
        jsonType: segmentSchemaType?.jsonType || '',
        segment,
      })

      isHidden =
        typeof hidden === 'function'
          ? hidden({
              document: fieldContext.document,
              getDocumentExists: fieldContext.getDocumentExists,
              parent: acc.object,
              path: newPath,
              type: segmentSchemaType,
            })
          : !!hidden

      return {
        ...acc,
        object,
        path: newPath,
      }
    },
    {
      object: fieldContext.document,
      path: [],
    },
  )

  return isHidden
}

export const getValidationResultMessage = (validationResult: ValidationMarker[]) => {
  if (!validationResult || !validationResult.length) {
    return true
  }

  const [{message}] = validationResult

  if (!message) {
    return true
  }

  return message
}

export const makeVisibleFieldValidator =
  <TRule extends RuleDef<TRule>>(rules: (rule: TRule) => TRule) =>
  (rule: TRule): RuleBuilder<TRule> => {
    const combinedRules = rules(rule)

    return rule.custom(async (value, context): Promise<CustomValidatorResult> => {
      const hiddenDelegate = context.type?.hidden

      const isHidden =
        typeof hiddenDelegate === 'function'
          ? hiddenDelegate({
              value,
              currentUser: null,
              parent: context.parent || {},
              document: context.document,
            })
          : !!hiddenDelegate

      if (
        isHidden ||
        isAnyOfAncestorsHidden(context) ||
        !('validate' in combinedRules) ||
        typeof combinedRules.validate !== 'function'
      ) {
        return true
      }

      const validationResult = await combinedRules.validate(value, context)

      return getValidationResultMessage(validationResult)
    })
  }

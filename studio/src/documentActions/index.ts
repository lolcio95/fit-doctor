import {DocumentActionComponent, DocumentActionsResolver} from 'sanity'

import {ResolveDocumentActionParams} from './types'
import {getPublishAction} from './utils'
import {getSchemaByType} from '../utils/document'
import {hasFieldsInSchema} from '../utils/schema'
import makeRebuildRequiredAction from '../actions/makeRebuildRequiredAction'
import {getDocumentOptions} from '../utils/studio'
import {GLOBAL_SETTINGS_TYPES} from '../structure'
import {GLOBAL_SETTING_FIELD_NAME} from '../schemaTypes/objects/globalSettings'
import {PUBLISHED_FIELD_NAME} from '../schemaTypes/objects/published'

const getAction = <T extends DocumentActionComponent>(actions: T[], actionName: T['action']): T => {
  const action = actions.find((a) => a.action === actionName)

  if (!action) {
    throw new Error(`Action ${actionName} not found`)
  }

  return action
}

export const resolveDocumentActions: DocumentActionsResolver = (actions, context) => {
  const {schema, schemaType} = context

  const documentSchema = getSchemaByType(schema, schemaType)

  const params: ResolveDocumentActionParams = {
    isGlobalSetting:
      hasFieldsInSchema(documentSchema) &&
      !!documentSchema.fields.find((field) => field.name === GLOBAL_SETTING_FIELD_NAME),
    hasPublishedField:
      hasFieldsInSchema(documentSchema) &&
      !!documentSchema.fields.find((field) => field.name === PUBLISHED_FIELD_NAME),
    draft: null,
    published: null,
  }

  const documentOptions = getDocumentOptions(documentSchema)
  const isPublishOnly = documentOptions?.publishOnly ?? false

  const defaultActions = !isPublishOnly
    ? actions
    : [getAction(actions, 'publish'), getAction(actions, 'discardChanges')]

  const requiresRebuild = GLOBAL_SETTINGS_TYPES.includes(schemaType)

  const customizedDefaultActions = defaultActions.reduce<DocumentActionComponent[]>(
    (customizedActions, action) => {
      switch (action?.action) {
        case 'publish': {
          const publishAction = getPublishAction(params, action)

          return [
            ...customizedActions,
            requiresRebuild ? makeRebuildRequiredAction(action) : publishAction,
          ]
        }
        default:
          return [...customizedActions, action]
      }
    },
    [],
  )

  return customizedDefaultActions
}

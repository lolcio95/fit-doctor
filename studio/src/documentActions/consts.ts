import {PatchOperations} from 'sanity'

import {ResolveDocumentActionParams} from './types'
import {PUBLISHED_FIELD_NAME} from '../schemaTypes/objects/published'

interface PrePublishActionConfig {
  patch: PatchOperations | ((params: ResolveDocumentActionParams) => PatchOperations)
  predicate: (params: ResolveDocumentActionParams) => boolean
}

export const PRE_PUBLISH_ACTIONS_CONFIG: PrePublishActionConfig[] = [
  {
    patch: ({draft, published}) => {
      const document = draft || published

      if (!document) {
        throw new Error('Could not resolve draft or published document')
      }

      return {
        set: {
          [PUBLISHED_FIELD_NAME]: document._id,
        },
      }
    },
    predicate: ({hasPublishedField}) => hasPublishedField,
  },
]

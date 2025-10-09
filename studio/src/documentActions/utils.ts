import {DocumentActionComponent, DocumentActionProps, PatchOperations} from 'sanity'

import {ResolveDocumentActionParams} from './types'
import makePublishAndDeployAction from '../actions/makePublishAndDeployAction'
import makeGlobalSettingPublishAction from '../actions/makeGlobalSettingPublishAction'
import makePatchAndPublishAction from '../actions/makePatchAndPublishAction'
import {PRE_PUBLISH_ACTIONS_CONFIG} from './consts'

const resolvePrePublishPatches = (
  props: DocumentActionProps,
  params: ResolveDocumentActionParams,
) =>
  PRE_PUBLISH_ACTIONS_CONFIG.reduce<PatchOperations[]>((acc, {patch, predicate}) => {
    const mergedParams = {...params, ...props}

    if (!predicate(mergedParams)) {
      return acc
    }

    return typeof patch === 'function' ? [...acc, patch(mergedParams)] : [...acc, patch]
  }, [])

export const getPublishAction = (
  params: ResolveDocumentActionParams,
  defaultAction: DocumentActionComponent,
): DocumentActionComponent => {
  const {isGlobalSetting} = params

  const patchAndPublishAction = makePatchAndPublishAction(
    defaultAction,
    (props: DocumentActionProps) => resolvePrePublishPatches(props, params),
  )

  return isGlobalSetting
    ? makeGlobalSettingPublishAction(patchAndPublishAction)
    : makePublishAndDeployAction(patchAndPublishAction)
}

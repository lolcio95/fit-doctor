import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
  PatchOperations,
  useDocumentOperation,
} from 'sanity'

const makePatchAndPublishAction = (
  basePublishAction: DocumentActionComponent,
  patches: PatchOperations[] | ((props: DocumentActionProps) => PatchOperations[]),
) => {
  const Action: DocumentActionComponent = (
    props: DocumentActionProps,
  ): DocumentActionDescription => {
    const publishAction = basePublishAction(props)
    const {patch} = useDocumentOperation(props.id, props.type)

    if (!publishAction) {
      throw new Error('Base publish action is required')
    }

    return {
      ...publishAction,
      onHandle: () => {
        const resolvedPatches = typeof patches === 'function' ? patches(props) : patches

        if (resolvedPatches.length > 0) {
          patch.execute(resolvedPatches)
        }

        publishAction?.onHandle?.()
      },
    }
  }

  Action.action = basePublishAction.action

  return Action
}

export default makePatchAndPublishAction

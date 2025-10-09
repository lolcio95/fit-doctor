import React, {useCallback, useState} from 'react'
import noop from 'lodash/noop'
import {Box, Grid, Button} from '@sanity/ui'
import {DocumentActionComponent, DocumentActionDescription, DocumentActionProps} from 'sanity'

import {triggerDeployment} from '../../utils/studio'

import {getRebuildInfo} from './utils'
import {PublishAndDeployActionModalMeta} from './types'

const makePublishAndDeployAction = (publishAction: DocumentActionComponent) => {
  const Action: DocumentActionComponent = (
    props: DocumentActionProps,
  ): DocumentActionDescription => {
    const basePublishAction = publishAction(props)

    if (!basePublishAction) {
      throw new Error('Base publish action is required')
    }

    const {published, draft} = props

    const [modalMeta, setModalMeta] = useState<PublishAndDeployActionModalMeta>({
      show: false,
      message: undefined,
      handler: noop,
    })

    const onClose = useCallback(
      () =>
        setModalMeta((currentModalMeta) => ({
          ...currentModalMeta,
          show: false,
        })),
      [],
    )

    return {
      ...basePublishAction,
      dialog: modalMeta.show && {
        type: 'dialog',
        onClose,
        header: 'Warning: Rebuild of the website needed',
        content: <Box>{modalMeta.message}</Box>,
        footer: (
          <Grid columns={2} gap={2}>
            <Button mode="ghost" justify="center" onClick={onClose} text="Cancel" />

            <Button
              text="Confirm"
              tone="critical"
              justify="center"
              onClick={() => {
                modalMeta.handler()
                onClose()
              }}
            />
          </Grid>
        ),
      },
      onHandle: async () => {
        const {rebuildNeeded, message} = await getRebuildInfo(draft, published)

        if (!rebuildNeeded) {
          return basePublishAction.onHandle?.()
        }

        return setModalMeta((currentModalMeta) => ({
          ...currentModalMeta,
          message,
          show: true,
          handler: () => {
            basePublishAction.onHandle?.()
            triggerDeployment()
          },
        }))
      },
    }
  }

  Action.action = publishAction.action

  return Action
}

export default makePublishAndDeployAction

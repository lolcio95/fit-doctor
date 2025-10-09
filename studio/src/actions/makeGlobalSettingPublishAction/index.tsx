import React, {useCallback, useState} from 'react'
import noop from 'lodash/noop'
import {Box, Grid, Button} from '@sanity/ui'
import {DocumentActionComponent, DocumentActionDescription, DocumentActionProps} from 'sanity'

import {triggerDeployment} from '../../utils/studio'

const makeGlobalSettingPublishAction =
  (publishAction: DocumentActionComponent) =>
  (props: DocumentActionProps): DocumentActionDescription => {
    const basePublishAction = publishAction(props)

    if (!basePublishAction) {
      throw new Error('Base publish action is required')
    }

    const [modalMeta, setModalMeta] = useState({
      show: false,
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
      dialog: modalMeta.show
        ? {
            type: 'dialog',
            onClose,
            header: 'Warning: Rebuild of the website needed',
            content: (
              <Box>
                The document you&apos;re trying to publish is a <strong>global setting</strong>.
                <br />
                <br />
                Publishing this document will trigger a rebuild of the website (you can track the
                build progress in the dashboard). Are you sure you want to proceed?
                <br />
                <br />
                You may also choose not to trigger a deployment and just publish the document,
                please note that in that case your changes <strong>won&apos;t</strong> be visible on
                the website.
              </Box>
            ),
            footer: (
              <Grid columns={3} gap={2}>
                <Button mode="ghost" justify="center" onClick={onClose} text="Cancel" />

                <Button
                  tone="critical"
                  justify="center"
                  text="Confirm"
                  onClick={() => {
                    modalMeta.handler()
                    onClose()
                  }}
                />

                <Button
                  text="Confirm & Deploy"
                  tone="primary"
                  justify="center"
                  onClick={() => {
                    modalMeta.handler()
                    triggerDeployment()
                    onClose()
                  }}
                />
              </Grid>
            ),
          }
        : undefined,
      onHandle: async () => {
        setModalMeta((currentModalMeta) => ({
          ...currentModalMeta,
          show: true,
          handler: () => {
            basePublishAction?.onHandle?.()
          },
        }))
      },
    }
  }

export default makeGlobalSettingPublishAction

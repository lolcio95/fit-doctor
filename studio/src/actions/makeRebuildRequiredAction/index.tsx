import React from 'react'
import noop from 'lodash/noop'
import {DocumentActionComponent} from 'sanity'
import {Button, Box, Grid} from '@sanity/ui'

import {triggerDeployment} from '../../utils/studio'
import {RebuildRequiredActionModalMeta} from './types'

const makeRebuildRequiredAction = (action: DocumentActionComponent) => {
  const Action: DocumentActionComponent = (props) => {
    const baseAction = action(props)

    const [modalMeta, setModalMeta] = React.useState<RebuildRequiredActionModalMeta>({
      show: false,
      type: 'rebuildRequired',
      // type === "rebuildRequired" indicates that we show RebuildRequiredModal
      // type === "nested" indicates that we show nested modal which is declared by action
      handler: noop,
    })

    const onClose = React.useCallback(
      () =>
        setModalMeta((currentModalMeta) => ({
          ...currentModalMeta,
          type: undefined,
          show: false,
        })),
      [],
    )

    const dialog =
      modalMeta.type === 'nested'
        ? baseAction?.dialog
        : {
            type: 'dialog' as const,
            onClose,
            header: 'Warning: Rebuild of the website needed',
            content: (
              <Box>
                Altering this document will trigger a rebuild of the website (you can track the
                build progress in the dashboard). Are you sure you want to proceed?
                <br />
                <br />
                You may also choose not to trigger a deployment and proceed with the action, please
                note that in that case your changes <strong>won&apos;t</strong> be visible on the
                website.
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
                  }}
                />

                <Button
                  text="Confirm & Deploy"
                  tone="primary"
                  justify="center"
                  onClick={() => {
                    modalMeta.handler()
                    triggerDeployment()
                  }}
                />
              </Grid>
            ),
          }

    return {
      ...baseAction,
      label: baseAction?.label || 'Rebuild',
      dialog: modalMeta.show && dialog,
      onHandle: async (...args) => {
        setModalMeta((currentModalMeta) => ({
          ...currentModalMeta,
          show: true,
          handler: () => {
            setModalMeta((prev) => ({...prev, type: 'nested'}))

            baseAction?.onHandle?.(...args)
          },
        }))
      },
    }
  }

  Action.action = action.action

  return Action
}

export default makeRebuildRequiredAction

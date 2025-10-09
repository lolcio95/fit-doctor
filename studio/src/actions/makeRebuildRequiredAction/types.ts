export interface RebuildRequiredActionModalMeta {
  show: boolean
  type: 'rebuildRequired' | 'nested' | undefined
  handler: VoidFunction
}

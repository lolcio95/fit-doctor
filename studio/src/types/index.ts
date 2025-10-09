import {IntrinsicDefinitions} from 'sanity'

declare module 'sanity' {
  interface DocumentOptions {
    creatable?: boolean
    publishOnly?: boolean
  }
}

export type ModelType = IntrinsicDefinitions[keyof IntrinsicDefinitions]

export interface TriggerVercelDeployResponse {
  url: string
}

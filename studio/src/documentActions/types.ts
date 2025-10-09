import { SanityDocument } from "sanity";

export interface ResolveDocumentActionParams {
  draft: SanityDocument | null;
  published: SanityDocument | null;
  isGlobalSetting: boolean;
  hasPublishedField: boolean;
}

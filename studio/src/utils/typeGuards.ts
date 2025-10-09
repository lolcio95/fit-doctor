import { SchemaType, isReference, Reference } from "sanity";

export const isStringIndexable = (
  value: unknown
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isSchemaObject = (obj: unknown): obj is SchemaType =>
  !!obj && typeof obj === "object" && "title" in obj && "name" in obj;

export const isArrayOfReferences = (
  value: unknown[] | undefined
): value is Reference[] => {
  if (!value) {
    return false;
  }

  return value.every((item) => isReference(item));
};

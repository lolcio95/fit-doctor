import {defineType} from 'sanity'

const VALID_SCHEMES = ['http', 'https', 'mailto', 'tel']
const message = `Url must start with ${VALID_SCHEMES.join('|')} to be valid`

export const externalLinkValidator = (value: unknown, validSchemes?: string[]) => {
  try {
    if (!value || typeof value !== 'string') {
      return true
    }

    const url = new URL(value)

    if (!(validSchemes || VALID_SCHEMES).includes(url.protocol.replace(':', ''))) {
      return message
    }

    return true
  } catch {
    return message
  }
}

export default defineType({
  title: 'External Link',
  type: 'string',
  name: 'externalUrl',
  description: message,
  validation: (rule) => rule.custom((value) => externalLinkValidator(value, VALID_SCHEMES)),
})

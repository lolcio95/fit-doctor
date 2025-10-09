import {Reference, Rule, Asset, SlugRule, ValidationBuilder, SlugValue} from 'sanity'
import {resolveReference} from './document'
import {getValidationResultMessage} from './misc'
import get from 'lodash/get'
import toString from 'lodash/toString'

const hasAsset = (item: unknown): item is {asset: Reference} =>
  !!item &&
  typeof item === 'object' &&
  'asset' in item &&
  typeof item.asset === 'object' &&
  !!item.asset &&
  '_ref' in item.asset

export const makeSvgImageValidator = (rules?: (rule: Rule) => Rule) => (rule: Rule) =>
  (rules ? rules(rule) : rule).custom(async (value) => {
    if (!hasAsset(value)) {
      return true
    }

    const {asset} = value

    if (!asset) {
      return true
    }

    const image = await resolveReference<Asset>(asset)

    if (!image) {
      return true
    }

    const {extension} = image

    return (
      extension === 'svg' ||
      `The image You uploaded has a type of ${extension}, however the image has to be an SVG`
    )
  })

export const makeSlugPrefixValidator = (prefix: string) => (rule: SlugRule) =>
  rule.custom((slug) => {
    const slugString = toString(get(slug, 'current'))

    if (!slugString) {
      return true
    }

    return slugString.startsWith(prefix) ? true : `The slug has to start with "${prefix}"`
  })

export const makeBaseSlugValidator =
  (rules?: (rule: SlugRule) => SlugRule, required = true): ValidationBuilder<SlugRule, SlugValue> =>
  (rule) =>
    rule.custom(async (slug, context) => {
      const {document} = context

      if (!document) {
        return true
      }

      const allRules = rules ? rules(rule) : rule

      if (required) {
        allRules.required()
      }

      /**
       * The cast to Rule is needed here, because Sanity transforms the RuleDef into the Rule in runtime
       * But this is not reflected in the types and the helpers functions are not exported
       */
      const validationResult = await (allRules as Rule).validate(slug, context)

      const errorOrResult = getValidationResultMessage(validationResult)

      return errorOrResult
    })

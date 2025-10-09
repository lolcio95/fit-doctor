import {
  ConditionalPropertyCallbackContext,
  defineType,
  InputProps,
  Reference,
  Rule,
  SanityDocument,
} from 'sanity'
import {getDocumentSections, getSchemaByType, resolveReference} from '../../../utils/document'
import {makeVisibleFieldValidator} from '../../../utils/misc'
import SectionLinkSelectInput from '../../../components/SectionLinkSelectInput'

const PAGE_TYPE = ['page', 'article']

export default defineType({
  title: 'Section Link',
  name: 'sectionLink',
  type: 'object',
  fields: [
    {
      name: 'page',
      type: 'reference',
      to: Object.values(PAGE_TYPE).map((pageType) => ({
        type: pageType,
      })),
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Section',
      name: 'sectionKey',
      type: 'string',
      components: {
        input: (props: InputProps) => <SectionLinkSelectInput {...props} />,
      },
      hidden: ({parent}: ConditionalPropertyCallbackContext) => !parent || !parent.page,
      validation: makeVisibleFieldValidator((Rule: Rule) =>
        Rule.custom(async (value, {parent, schema}) => {
          if (!parent) {
            return true
          }

          const document =
            parent instanceof Object && 'page' in parent && parent.page
              ? await resolveReference<SanityDocument>(parent.page as Reference)
              : undefined
          const sections = document ? getDocumentSections(document, schema) : []

          return sections.some(({value: sectionKey}) => sectionKey === value)
            ? true
            : 'The section does not exist on this page. (It was probably removed)'
        }),
      ),
    },
  ],
  preview: {
    select: {
      pageSections: 'page.sections',
      sectionKey: 'sectionKey',
    },
    prepare: ({pageSections, sectionKey}) => {
      const section = pageSections?.find(({_key}: {_key: string}) => _key === sectionKey)

      const schema = section?._type ? getSchemaByType(section?._type) : undefined

      return {
        title: 'Section Link',
        subtitle: schema?.title,
      }
    },
  },
})

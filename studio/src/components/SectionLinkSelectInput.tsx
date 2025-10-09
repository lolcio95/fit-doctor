import React, {useEffect, useState} from 'react'
import {getDocumentSections, resolveReference} from '../utils/document'
import {InputProps, Reference, SanityDocument, set, unset, useFormValue, useSchema} from 'sanity'
import {Select} from '@sanity/ui'

const SectionLinkSelectInput = (props: InputProps) => {
  const [list, setList] = useState<{title: string; value: string}[]>([])
  const {path, onChange, value} = props
  const sectionLink = useFormValue(path.slice(0, -1)) as unknown as {page: Reference | undefined} // Assuming the last part of the path is 'sectionKey'
  const schema = useSchema()

  useEffect(() => {
    ;(async () => {
      const document = sectionLink?.page
        ? await resolveReference<SanityDocument>(sectionLink.page)
        : undefined

      if (!document) {
        return
      }

      const sections = getDocumentSections(document, schema)

      setList(sections)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sectionLink?.page)])

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLSelectElement> | undefined) => {
      const value = event?.currentTarget.value

      // If the selected option has a value,
      // it will be written to the document
      // otherwise the field will be cleared
      onChange(value ? set(value) : unset())
    },
    [onChange],
  )

  return (
    <Select onChange={handleChange} value={typeof value === 'string' ? value : undefined}>
      {list.map((item) => (
        <option key={item.value} value={item.value}>
          {item.title}
        </option>
      ))}
    </Select>
  )
}

export default SectionLinkSelectInput

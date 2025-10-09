import React from 'react'
import groq from 'groq'
import startCase from 'lodash/startCase'
import get from 'lodash/get'
import {SanityDocument} from 'sanity'

import {makeSanityClient} from '../../utils/studio'
import {formatter, PROPERTIES_REQUIRING_REBUILD} from './consts'

const getChangedPropertiesRequiringRebuild = (
  publishedDocument: SanityDocument | null,
  draftDocument?: SanityDocument | null,
) =>
  PROPERTIES_REQUIRING_REBUILD.filter(
    (field) => get(publishedDocument, field) !== get(draftDocument, field),
  )

const formatTypes = (types: {_type: string}[]) =>
  formatter.format(new Set(types.map(({_type}) => startCase(_type))))

const formatProperties = (properties: string[]) =>
  formatter.format(
    properties.map((property) => startCase(property.slice(0, property.indexOf('.')))),
  )

export const getRebuildInfo = async (
  draftDocument?: SanityDocument | null,
  publishedDocument?: SanityDocument | null,
) => {
  if (!publishedDocument?._id) {
    return {
      rebuildNeeded: false,
    }
  }

  const changedPropertiesRequiringRebuild = getChangedPropertiesRequiringRebuild(
    publishedDocument,
    draftDocument,
  )

  if (changedPropertiesRequiringRebuild.length <= 0) {
    return {
      rebuildNeeded: false,
    }
  }

  const globalSettingsReferencingTheDocument = await makeSanityClient().fetch(
    groq`*[!(_id in path("drafts.**")) && globalSetting == true && references($id)] { _type }`,
    {
      id: publishedDocument._id,
    },
  )

  if (globalSettingsReferencingTheDocument.length <= 0) {
    return {
      rebuildNeeded: false,
    }
  }

  const formattedTypes = formatTypes(globalSettingsReferencingTheDocument)

  const formattedProperties = formatProperties(changedPropertiesRequiringRebuild)

  return {
    rebuildNeeded: true,
    message: (
      <>
        The document you&apos;re trying to publish is referenced by{' '}
        <strong>{formattedTypes}</strong>.
        <br />
        <br />
        Because you&apos;ve changed the following properties -{' '}
        <strong>{formattedProperties}</strong> - publishing this document will trigger a rebuild of
        the website (you can track the build progress in the dashboard). Are you sure you want to
        proceed?
      </>
    ),
  }
}

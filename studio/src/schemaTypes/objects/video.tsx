import {defineType} from 'sanity'

const videoTypesList = [
  {title: 'YouTube', value: 'youtube'},
  {title: 'HubSpot', value: 'hubspot'},
]

export const video = defineType({
  name: 'video',
  type: 'object',
  fields: [
    {
      name: 'videoType',
      title: 'Video type',
      description: 'Select the type of video',
      type: 'string',
      options: {
        list: videoTypesList,
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {videoType?: string}
          if (parent.videoType === 'youtube' && !value) {
            return 'Video ID is required'
          }

          return true
        }),
      hidden: ({parent}) => !parent?.videoType || parent?.videoType !== 'youtube',
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      description: 'URL must start with https://go.wealtharc.com/hubfs/ to be valid',
      type: 'string',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {videoType?: string}
          if (parent.videoType === 'hubspot' && !value) {
            return 'Video URL is required'
          }

          if (parent.videoType === 'hubspot' && value) {
            try {
              const url = new URL(value as string)

              if (url.protocol !== 'https:' && url.hostname !== 'go.wealtharc.com/') {
                return 'URL must start with https://go.wealtharc.com/'
              }

              if (!url.pathname || url.pathname === '/' || !url.pathname.startsWith('/hubfs/')) {
                return 'Invalid URL. Please provide a valid URL.'
              }
            } catch {
              // If the URL constructor throws, it's not a valid URL
              return 'Invalid URL. Please provide a valid URL.'
            }
          }

          return true
        }),
      hidden: ({parent}) => !parent?.videoType || parent?.videoType !== 'hubspot',
    },
  ],
  preview: {
    select: {
      videoType: 'videoType',
      videoUrl: 'videoUrl',
      videoId: 'videoId',
    },
    prepare(selection) {
      const {videoType, videoId, videoUrl} = selection

      return {
        title: videoTypesList.find((item) => item.value === videoType)?.title || 'Video',
        subtitle: videoType === 'youtube' ? `Video ID: ${videoId}` : `Video URL: ${videoUrl}`,
      }
    },
  },
})

import {defineType} from 'sanity'

export default defineType({
  title: 'Internal Link',
  name: 'internalLink',
  type: 'reference',
  to: [{type: 'page'}, {type: 'article'}],
})

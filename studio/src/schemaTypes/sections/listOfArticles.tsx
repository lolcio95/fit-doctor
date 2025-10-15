import {DashboardIcon} from '@sanity/icons'
import {withDefaultGroup} from '../../utils/enhancers'
import {section} from '../objects/section'
import {extendModel} from '../../utils/model'
import {ConditionalPropertyCallbackContext, Rule} from 'sanity'
import {colorsMap} from '../../setup/sectionColors'
import {makeVisibleFieldValidator} from '../../utils/misc'

export const listOfArticles = withDefaultGroup(
  extendModel(section, {
    name: 'listOfArticles',
    title: 'List of Articles',
    type: 'object',
    icon: DashboardIcon,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'text',
        initialValue: 'Recent articles',
      },
      {
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: [
            {title: 'Recent', value: 'recent'},
            {title: 'Custom', value: 'custom'},
            {title: 'All', value: 'all'},
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
        initialValue: 'recent',
      },
      {
        name: 'allArticlesButton',
        type: 'labeledLink',
        title: 'All Articles Button',
        hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.type === 'all',
        description: 'Button to link to all articles page',
        validation: makeVisibleFieldValidator<Rule>((rule) => rule.required()),
      },
      {
        name: 'customArticles',
        title: 'Custom Articles',
        type: 'array',
        hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.type !== 'custom',
        validation: (Rule: Rule) =>
          Rule.custom((articles, context) => {
            if (
              Array.isArray(articles) &&
              articles.length !== 4 &&
              // @ts-ignore
              context.parent.type === 'custom'
            ) {
              return 'You should add 4 articles'
            }
            return true
          }),
        of: [
          {
            name: 'article',
            type: 'reference',
            to: [{type: 'article'}],
          },
        ],
      },
    ],
    initialValue: {
      backgroundColor: colorsMap['Background Primary'],
    },
    preview: {
      select: {
        title: 'title',
      },
      prepare({title = ''}) {
        return {
          title,
          subtitle: 'List of articles section',
        }
      },
    },
  }),
)

import {ImageIcon} from '@sanity/icons'
import {withDefaultGroup} from '../../utils/enhancers'
import {extendModel} from '../../utils/model'
import {section} from '../objects/section'
import { colorsMap } from '../../setup/sectionColors'

interface PlanCard {
  highlighted: boolean;
  highlightedText?: string;
  title: string;
  price: number;
  advantages: string[];
}

interface PlansSection {
  title: string;
  description: string;
  plans: PlanCard[];
}

export const plans = withDefaultGroup(
  extendModel(section, {
    name: 'plans',
    title: 'Plans',
    icon: ImageIcon,
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'plans',
        type: 'array',
        of: [
          {
            name: 'Card',
            type: 'object',
            fields: [
              {
                name: 'highlighted',
                title: 'Highlighted',
                type: 'boolean',
                initialValue: false,
              },
              {
                name: 'highlightedText',
                title: 'Highlighted Text',
                type: 'string',
                validation: (Rule: any) =>
                  Rule.custom((value: string, context: { parent?: PlanCard }) => {
                    if (context.parent?.highlighted && !value) {
                      return 'To pole jest wymagane, jeśli plan jest wyróżniony!';
                    }
                    return true;
                  }),
              },
              {
                name: 'title',
                title: 'Title',
                type: 'string',
              },
              {
                name: 'price',
                title: 'Price',
                type: 'number',
              },
              {
                name: 'advantages',
                title: 'Advantages',
                type: 'array',
                of: [{type: 'string'}],
              }
            ],
            preview: {
              select: {
                title: 'title',
              },
            },
          },
        ],
      },
    ],
    initialValue: {
      backgroundColor: colorsMap['Background Primary'],
    },
    preview: {
      prepare(): { title: string } {
        return {
          title: 'Plans',
        }
      },
    },
  }),
)
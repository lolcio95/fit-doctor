import {
  MdAlignHorizontalCenter,
  MdAlignHorizontalLeft,
  MdAlignHorizontalRight,
  MdSubscript,
  MdSuperscript,
} from 'react-icons/md'
import {ColorWheelIcon, LinkIcon} from '@sanity/icons'
import {ArrayOfType, BlockDecoratorDefinition, BlockStyleDefinition} from 'sanity'

export const commonDecorators: BlockDecoratorDefinition[] = [
  {title: 'Strong', value: 'strong'},
  {title: 'Emphasis', value: 'em'},
  {title: 'Inline code', value: 'code'},
  {
    title: 'Text left',
    value: 'left',
    component: (props) => <p style={{margin: 0, textAlign: 'left'}}>{props.children}</p>,
    icon: MdAlignHorizontalLeft,
  },
  {
    title: 'Text center',
    value: 'center',
    component: (props) => <p style={{margin: 0, textAlign: 'center'}}>{props.children}</p>,
    icon: MdAlignHorizontalCenter,
  },
  {
    title: 'Text right',
    value: 'right',
    component: (props) => <p style={{margin: 0, textAlign: 'right'}}>{props.children}</p>,
    icon: MdAlignHorizontalRight,
  },
  {
    title: 'Sup',
    value: 'sup',
    component: (props) => <sup>{props.children}</sup>,
    icon: MdSuperscript,
  },
  {
    title: 'Sub',
    value: 'sub',
    component: (props) => <sub>{props.children}</sub>,
    icon: MdSubscript,
  },
]

export const commonAnnotations: ArrayOfType<'object' | 'reference', undefined>[] = [
  {
    type: 'simplerColor',
    title: 'Color',
    icon: ColorWheelIcon,
  },
  {
    name: 'link',
    type: 'link',
    title: 'Link',
    icon: LinkIcon,
  },
]

export const commonParagraphStyles: BlockStyleDefinition[] = [
  {
    title: 'Paragraph (16px)',
    value: 'paragraph',
    component: (props) => (
      <p style={{fontSize: 16, margin: 0, fontWeight: '400'}}>{props.children}</p>
    ),
  },
  {
    title: 'Lead (20px)',
    value: 'lead',
    component: (props) => (
      <p style={{fontSize: 20, margin: 0, fontWeight: '400'}}>{props.children}</p>
    ),
  },
  {
    title: 'Large (18px)',
    value: 'large',
    component: (props) => (
      <p style={{fontSize: 18, margin: 0, fontWeight: '600'}}>{props.children}</p>
    ),
  },
  {
    title: 'Small (14px)',
    value: 'small',
    component: (props) => (
      <p style={{fontSize: 14, margin: 0, fontWeight: '500'}}>{props.children}</p>
    ),
  },
]

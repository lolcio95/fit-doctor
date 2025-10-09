import {FieldGroupDefinition} from 'sanity'

export default {
  MAIN: {title: 'Main', name: 'main', default: true},
  SEO: {title: 'SEO', name: 'seo'},
  SEO_DEFAULT: {title: 'Default', name: 'seoDefault'},
  SEO_OPEN_GRAPH: {title: 'Open Graph', name: 'seoOpenGraph'},
  ACCESSIBILITY: { title: "Accessibility", name: "accessibility" },
  INFO: {title: 'Info', name: 'info'},
  TOP: {name: 'top', title: 'Top'},
  BOTTOM: {name: 'bottom', title: 'Bottom'},
  APPEARANCE: {name: 'appearance', title: 'Appearance'},
} satisfies Record<string, FieldGroupDefinition>

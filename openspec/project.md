# Project Context

## Purpose
FitDoctor is a modern health and fitness website built with Next.js and Sanity CMS. The project provides a powerful content management system with real-time visual editing capabilities, featuring a page builder with drag-and-drop functionality, testimonials, plans section, gallery, and comprehensive article management. The site is designed to deliver health and fitness content, advisor profiles, and interactive features for users seeking fitness guidance.

## Tech Stack
- **Framework**: Next.js 15 with App Router and Turbo
- **CMS**: Sanity Studio with Visual Editing and Presentation Tool
- **Language**: TypeScript 5.6.3
- **Styling**: Tailwind CSS 4.1.4 with custom design system
- **UI Components**: Radix UI primitives with custom components
- **Authentication**: NextAuth.js 4.24.11
- **Animations**: Tailwind CSS Animate + tw-animate-css
- **Image Handling**: Sanity Image URL with Unsplash integration
- **Database**: Sanity hosted dataset
- **Deployment**: Vercel with automated deployment hooks
- **Package Management**: npm with workspaces (monorepo structure)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled, explicit types preferred
- **File Naming**: camelCase for files, PascalCase for React components
- **Import Organization**: Absolute imports from workspace root, grouped by type (external, internal, relative)
- **Component Structure**: Atomic design pattern (atoms, molecules, organisms)
- **Prettier Configuration**: 
  - No semicolons (`"semi": false`)
  - Print width: 100 characters
  - No bracket spacing (`"bracketSpacing": false`)
  - Single quotes (`"singleQuote": true`)

### Architecture Patterns
- **Monorepo Structure**: Separate workspaces for `nextjs-app` and `studio`
- **Page Builder Pattern**: Modular sections system with reusable blocks
- **Component Architecture**: 
  - `atoms/`: Basic UI components (buttons, inputs, typography)
  - `molecules/`: Component combinations (cards, forms)
  - `organisms/`: Complex components (headers, galleries, testimonials)
  - `blocks/`: Page-level sections for the page builder
- **Data Fetching**: Server-side rendering with Sanity's `sanityFetch` utility
- **Real-time Updates**: Live Content API integration for instant content updates
- **Schema-First Development**: Sanity schema types drive TypeScript interfaces

### Testing Strategy
- **Framework**: Next.js built-in testing with ESLint
- **Type Safety**: TypeScript strict mode with Sanity type generation
- **Code Quality**: ESLint with Next.js configuration
- **Build Validation**: Type checking during build process

### Git Workflow
- **Branch Strategy**: Main branch with feature branches
- **Commit Conventions**: Standard commit messages
- **Deployment**: Automated Vercel deployment on main branch push
- **Content Updates**: Real-time publishing through Sanity Studio

## Domain Context
- **Health & Fitness Focus**: Content related to fitness advice, health tips, workout plans
- **Advisor System**: Professional fitness advisors with profiles, bio, languages, and Calendly integration
- **Article Management**: Categorized health articles with rich text content
- **Plans & Pricing**: Subscription or service plans with highlighting and advantage lists
- **Testimonials**: Customer success stories and reviews
- **Visual Content**: Image galleries and media management for fitness-related content

## Important Constraints
- **Performance**: Next.js 15 with Turbo mode for fast development and builds
- **SEO Requirements**: Server-side rendering for all public content
- **Content Security**: Draft mode for preview functionality
- **Image Optimization**: Sanity CDN with automatic image optimization
- **Real-time Editing**: Visual editing capabilities must be preserved
- **Mobile Responsiveness**: Tailwind CSS responsive design system
- **Accessibility**: Radix UI components ensure accessibility compliance

## External Dependencies
- **Sanity**: Headless CMS with hosted dataset and media management
- **Vercel**: Hosting platform with edge functions and ISR
- **Unsplash**: Stock photography integration for media assets
- **Calendly**: Appointment booking integration for advisors
- **NextAuth**: Authentication provider integration
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for UI elements
- **Embla Carousel**: Carousel functionality for testimonials and galleries

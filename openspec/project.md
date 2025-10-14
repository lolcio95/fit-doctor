# Project Context

## Purpose
FitDoctor is a comprehensive fitness and health management web application designed to help users track their fitness journey, connect with fitness professionals, and achieve their health goals. The platform provides features for workout tracking, nutrition planning, professional consultations, and community engagement.

## Tech Stack
- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Lucide Icons
- **CMS**: Sanity Studio (headless CMS)
- **Content API**: Sanity Live Content API with real-time updates
- **Authentication**: NextAuth.js
- **State Management**: React Hooks, RxJS
- **Image Handling**: Sanity Image URL, Unsplash integration
- **Deployment**: Vercel (Next.js) + Sanity Cloud (Studio)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier configuration (semi: false, printWidth: 100, singleQuote: true, bracketSpacing: false)
- **Linting**: ESLint with Next.js configuration
- **Naming**: 
  - Components: PascalCase
  - Files: kebab-case for components, camelCase for utilities
  - Variables: camelCase
  - Types/Interfaces: PascalCase

### Architecture Patterns
- **Monorepo**: Workspace structure with separate `nextjs-app` and `studio` directories
- **App Router**: Next.js 15 App Router for routing and layouts
- **Component Structure**: Atomic design with components, hooks, utils, and types directories
- **CMS Integration**: Sanity Studio embedded at `/studio` route
- **Visual Editing**: Presentation Tool for real-time content editing
- **Content Modeling**: Schema-first approach with TypeGen for type safety
- **Page Builder**: Dynamic sections with drag-and-drop capability

### Testing Strategy
- Focus on Next.js build validation
- Type safety with TypeScript strict mode
- Sanity schema validation
- Manual testing for UI/UX verification

### Git Workflow
- Feature branches for new development
- Commit conventions: Descriptive commit messages
- PR-based workflow with code review
- Automated type generation pre-build

## Domain Context
- **Fitness Industry**: Platform serves fitness professionals, trainers, nutritionists, and end users
- **Content Types**: Pages, Articles (blog posts), People (team members/professionals), Settings
- **Visual Editing**: Content editors need real-time preview of changes
- **Media Management**: Heavy use of images for fitness content, exercises, and testimonials
- **SEO**: Strong focus on SEO optimization for organic discovery

## Important Constraints
- **Sanity Studio**: Embedded within Next.js app at `/studio` route
- **Type Safety**: Must maintain TypeGen synchronization between Sanity schema and TypeScript types
- **Real-time Updates**: Live Content API requires proper configuration
- **Image Optimization**: Next.js Image optimization must work with Sanity CDN
- **Environment Variables**: Requires SANITY_API_READ_TOKEN for draft mode and presentation tool

## External Dependencies
- **Sanity Cloud**: Hosted dataset and asset management
- **Vercel**: Hosting and deployment platform
- **Unsplash**: Stock image integration for media library
- **Sanity AI Assist**: AI-powered content assistance
- **Vercel Speed Insights**: Performance monitoring

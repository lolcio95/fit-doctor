# FitDoctor Technical Architecture

## System Overview
FitDoctor uses a modern JAMstack architecture with Next.js as the frontend framework and Sanity as the headless CMS backend. This architecture provides optimal performance, scalability, and developer experience.

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Browser/Mobile)                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App Router (Next.js 15)                             │  │
│  │  - Pages & Layouts                                    │  │
│  │  - API Routes                                         │  │
│  │  - Server Components                                  │  │
│  │  - Client Components                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Embedded Sanity Studio (/studio)                    │  │
│  │  - Visual Editor                                      │  │
│  │  - Content Management                                 │  │
│  │  - Presentation Tool                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Sanity Content Lake                       │
│  - Content Documents                                         │
│  - Media Assets (CDN)                                        │
│  - Live Content API                                          │
│  - GROQ Query Engine                                         │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Detail

### Frontend Layer
- **Next.js 15**: React framework with App Router
  - Server Components for optimal performance
  - Client Components for interactivity
  - Automatic code splitting
  - Image optimization
  - Font optimization
  
- **React 19**: UI library
  - Server Components
  - Suspense boundaries
  - Streaming SSR
  - Concurrent rendering

- **TypeScript**: Type-safe development
  - Strict mode enabled
  - Generated types from Sanity schemas
  - Type inference
  - IDE support

### Styling Layer
- **Tailwind CSS v4**: Utility-first CSS framework
  - Custom design system
  - Responsive utilities
  - Dark mode support (future)
  - JIT compilation

- **Radix UI**: Unstyled, accessible components
  - Dialog/Modal
  - Accordion
  - Tabs
  - Avatar
  - Aspect Ratio

- **CSS Animations**: 
  - Tailwind CSS Animate
  - Custom keyframe animations
  - Intersection Observer triggers

### Content Management Layer
- **Sanity Studio**: Headless CMS
  - Real-time collaboration
  - Custom schema definitions
  - Field validation
  - Custom input components
  - Plugin ecosystem

- **Sanity Client**: Data fetching
  - GROQ queries
  - Live Content API
  - Draft mode support
  - CDN caching

### Data Flow Architecture

#### Content Creation Flow
```
1. Content Editor → Sanity Studio
2. Editor creates/updates content
3. Content saved to Sanity dataset
4. TypeGen generates TypeScript types
5. Next.js queries content via GROQ
6. Pages render with updated content
```

#### Real-time Update Flow
```
1. Content change in Sanity
2. Live Content API webhook
3. Next.js receives update
4. ISR revalidation triggered
5. Page regenerated
6. User sees updated content
```

### File Structure
```
fit-doctor/
├── nextjs-app/                 # Next.js application
│   ├── app/                    # App router pages
│   │   ├── (studio)/          # Studio route group
│   │   │   └── studio/        # Embedded Sanity Studio
│   │   ├── (frontend)/        # Public-facing routes
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── [slug]/        # Dynamic pages
│   │   └── api/               # API routes
│   │       └── draft-mode/    # Draft preview
│   ├── components/            # React components
│   │   ├── ui/               # Radix UI wrappers
│   │   ├── sections/         # Page builder sections
│   │   └── shared/           # Shared components
│   ├── sanity/               # Sanity integration
│   │   ├── lib/              # Client & queries
│   │   └── schemas/          # Type definitions
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript types
│   └── public/               # Static assets
│
├── studio/                    # Sanity Studio config
│   ├── src/
│   │   ├── schemaTypes/      # Content schemas
│   │   ├── components/       # Custom Studio components
│   │   ├── structure.ts      # Studio structure
│   │   └── documentActions/  # Custom actions
│   ├── sanity.config.ts      # Studio configuration
│   └── package.json
│
└── openspec/                  # OpenSpec specifications
    ├── project.md
    ├── specs/
    └── changes/
```

## Component Architecture

### Page Components (Server Components)
```typescript
// app/page.tsx - Server Component
import { sanityFetch } from '@/sanity/lib/live'
import { homeQuery } from '@/sanity/lib/queries'

export default async function HomePage() {
  const { data } = await sanityFetch({ query: homeQuery })
  return <HomePageContent data={data} />
}
```

### Section Components (Dynamic)
```typescript
// components/sections/HeroSection.tsx
export function HeroSection({ title, subtitle, image, cta }) {
  return (
    <section className="hero">
      <Image src={image} alt={title} />
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <Button href={cta.href}>{cta.text}</Button>
    </section>
  )
}
```

### Sanity Schema Example
```typescript
// studio/src/schemaTypes/page.ts
export default {
  name: 'page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'sections', type: 'array', of: [
      { type: 'hero' },
      { type: 'contentGrid' },
      { type: 'testimonials' }
    ]}
  ]
}
```

## Data Fetching Strategies

### Static Site Generation (SSG)
- Used for: Article pages, team profiles, most pages
- Benefits: Fast, cacheable, SEO-friendly
- Revalidation: On-demand via Live Content API

### Server-Side Rendering (SSR)
- Used for: Draft preview, dynamic data
- Benefits: Real-time data, personalization
- Use case: Content editors previewing drafts

### Client-Side Rendering (CSR)
- Used for: Interactive features, forms
- Benefits: Rich interactivity, instant feedback
- Use case: Contact forms, search filters

## API Integration

### Sanity Content API
```typescript
// Fetch content with GROQ
const query = `*[_type == "page" && slug.current == $slug][0]{
  title,
  slug,
  sections[]{
    _type,
    _key,
    ...
  }
}`

const page = await client.fetch(query, { slug })
```

### Draft Mode API
```typescript
// api/draft-mode/enable/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  
  draftMode().enable()
  redirect(`/${slug}`)
}
```

## Performance Optimization

### Image Optimization
- Next.js Image component
- Automatic WebP/AVIF conversion
- Lazy loading
- Responsive sizes
- Sanity CDN integration

### Code Splitting
- Route-based automatic splitting
- Dynamic imports for heavy components
- React.lazy() for client components

### Caching Strategy
- Static pages: ISR with on-demand revalidation
- API responses: Cache headers
- Images: Sanity CDN + Next.js optimization
- CSS: Build-time generation

### Bundle Optimization
- Tree shaking (automatic)
- Minimize client-side JavaScript
- Server Components by default
- Selective client components

## Security Considerations

### Authentication
- Sanity Studio: OAuth (Google, GitHub)
- Draft mode: Token-based authentication
- API routes: Environment variable secrets

### Content Security
- CORS configuration
- API token rotation
- Read-only tokens for public data
- Admin tokens for mutations

### Data Validation
- TypeScript type checking
- Sanity schema validation
- Form validation (Zod/Yup)
- Sanitize user inputs

## Monitoring & Analytics

### Performance Monitoring
- Vercel Speed Insights
- Core Web Vitals tracking
- Real User Monitoring (RUM)

### Error Tracking
- Error boundaries
- Console error logging
- Vercel error reporting

### Analytics
- Pageview tracking
- Event tracking
- Conversion tracking
- A/B testing (future)

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development servers
npm run dev
# - Next.js: http://localhost:3000
# - Sanity Studio: http://localhost:3333

# Type generation
npm run typegen

# Build for production
npm run build
```

### Git Workflow
1. Feature branch from main
2. Make changes
3. Type generation (pre-commit)
4. Build verification
5. Pull request
6. Code review
7. Merge to main
8. Automatic deployment

### Deployment Pipeline
1. **Push to GitHub**
2. **Vercel Build**:
   - Install dependencies
   - Generate types
   - Build Next.js app
   - Run tests (if any)
3. **Deploy**:
   - Preview: PR deployments
   - Production: Main branch
4. **Post-deploy**:
   - Cache invalidation
   - Health check

## Scalability Considerations

### Content Scalability
- Sanity handles millions of documents
- CDN for global asset delivery
- Incremental Static Regeneration
- On-demand revalidation

### Performance Scalability
- Edge network deployment (Vercel)
- Static page generation
- Minimal client-side JavaScript
- Progressive enhancement

### Team Scalability
- TypeScript for code maintainability
- Component-based architecture
- Clear separation of concerns
- Documentation via OpenSpec

## Future Architecture Enhancements
- **Database**: Add PostgreSQL for user data
- **Auth**: Implement user authentication
- **API**: GraphQL API layer
- **Real-time**: WebSocket for live features
- **Mobile**: React Native app
- **Microservices**: Separate services for specific features
- **CDN**: CloudFront or Cloudflare for additional caching

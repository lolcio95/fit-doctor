# FitDoctor Web Application Specification

## Overview
FitDoctor is a comprehensive fitness and health management platform built with Next.js 15 and Sanity CMS, providing users with tools to track fitness progress, access professional guidance, and engage with a health-focused community.

## Core Features

### 1. Home Page & Landing Experience
- **Hero Section**: Compelling value proposition with CTA buttons
- **Services Overview**: Highlight key offerings (Personal Training, Nutrition, Online Coaching)
- **Testimonials**: Client success stories and reviews
- **Team Preview**: Featured fitness professionals
- **Blog Preview**: Latest articles and health tips
- **Contact Section**: Lead capture form

### 2. Content Management (Sanity CMS)
- **Page Builder**: Dynamic sections with drag-and-drop editing
- **Visual Editing**: Real-time preview with Presentation Tool
- **Content Types**:
  - Pages (dynamic landing pages)
  - Articles (blog posts with categories and tags)
  - People (team members, trainers, professionals)
  - Settings (global site configuration, SEO defaults)
- **Media Library**: Image management with Unsplash integration
- **SEO Management**: Per-page metadata and Open Graph settings

### 3. Blog & Articles
- **Article Listing**: Filterable by category, date, author
- **Article Detail**: Rich content with images, videos, code blocks
- **Related Articles**: Contextual recommendations
- **Author Profiles**: Linked to People documents
- **Social Sharing**: Share buttons for major platforms
- **Comments**: Future integration option

### 4. Team & Professionals
- **Team Directory**: Browse fitness professionals
- **Professional Profiles**: Bio, credentials, specialties, contact
- **Booking Integration**: Link to scheduling system
- **Testimonials**: Client reviews per professional

### 5. Services Pages
- **Personal Training**: Program details, pricing, benefits
- **Nutrition Coaching**: Meal planning, consultation info
- **Online Coaching**: Virtual training options
- **Group Classes**: Schedule and registration
- **Custom Programs**: Specialized training packages

### 6. User Experience Features
- **Responsive Design**: Mobile-first approach
- **Fast Performance**: Next.js optimization, image optimization
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Accessibility**: WCAG compliance, keyboard navigation
- **Analytics**: Vercel Speed Insights integration

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Tailwind CSS animations

### Content Management
- **CMS**: Sanity Studio v3
- **Content API**: Sanity Live Content API
- **Schema**: TypeScript-generated types
- **Visual Editing**: Embedded Presentation Tool
- **Draft Mode**: Preview unpublished content

### Data Flow
1. **Content Creation**: Editors use Sanity Studio
2. **Type Generation**: Automatic TypeScript type generation
3. **Data Fetching**: GROQ queries with next-sanity
4. **Real-time Updates**: Live Content API for instant updates
5. **Static Generation**: ISR for optimal performance

### Routing Structure
```
/ (home)
/insights-articles/:slug (blog posts)
/team/:slug (professional profiles)
/:slug (dynamic pages)
/studio (embedded Sanity Studio)
```

### Component Architecture
```
components/
├── ui/ (Radix UI wrappers)
├── sections/ (page builder sections)
├── forms/ (contact, booking forms)
└── shared/ (header, footer, navigation)
```

## Content Schema

### Page Document
- Title
- Slug
- SEO settings (title, description, og:image)
- Sections array (flexible page builder)
- Published date

### Article Document
- Title
- Slug
- Author (reference to Person)
- Categories
- Tags
- Featured image
- Content (portable text)
- SEO settings
- Published date

### Person Document
- Name
- Slug
- Role/Title
- Bio (portable text)
- Profile image
- Specialties
- Contact information
- Social links

### Settings Document (Singleton)
- Site title
- Default SEO settings
- Social media links
- Contact information
- Navigation menu structure

## Page Builder Sections

### Available Sections
1. **Hero Section**: Large banner with image, heading, subheading, CTA
2. **Content Grid**: Multi-column content blocks
3. **Feature Showcase**: Service/feature highlights with icons
4. **Testimonial Carousel**: Rotating client testimonials
5. **Team Grid**: Professional profiles display
6. **Article Grid**: Blog post previews
7. **Call-to-Action**: Conversion-focused section
8. **Contact Form**: Lead capture with validation
9. **Stats Counter**: Animated statistics display
10. **FAQ Accordion**: Collapsible Q&A sections

## SEO Strategy

### On-Page SEO
- Unique title and meta description per page
- Open Graph tags for social sharing
- Structured data (JSON-LD)
- Semantic HTML markup
- Optimized images with alt text

### Technical SEO
- XML sitemap generation
- Robots.txt configuration
- Canonical URLs
- Fast page load times
- Mobile responsiveness

### Content SEO
- Keyword-optimized articles
- Internal linking strategy
- Regular content updates
- Long-form blog posts

## Performance Requirements
- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Image Optimization**: Automatic next/image handling
- **Code Splitting**: Route-based splitting

## Accessibility Requirements
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators
- Skip links

## Deployment

### Environments
- **Development**: Local (localhost:3000)
- **Preview**: Vercel preview deployments (PRs)
- **Production**: Vercel production (main branch)

### CI/CD Pipeline
1. Push to branch
2. Type generation
3. Build verification
4. Automated deployment (Vercel)
5. Sanity Studio deployment (separate)

### Environment Variables
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Dataset name (production)
- `SANITY_API_READ_TOKEN`: Read token for draft mode
- `NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL`: Preview URL

## Future Enhancements
- User authentication and personal dashboards
- Workout tracking functionality
- Nutrition logging
- Progress photos and measurements
- Appointment booking system
- Payment integration
- Mobile app (React Native)
- Push notifications
- Live video consultations

## Success Metrics
- Page load performance (Core Web Vitals)
- Content editor satisfaction (ease of use)
- SEO rankings (organic traffic)
- Conversion rates (contact form submissions)
- User engagement (time on site, pages per session)

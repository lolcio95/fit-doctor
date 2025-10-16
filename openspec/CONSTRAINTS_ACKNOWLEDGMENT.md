# Constraints Acknowledgment

This document acknowledges the constraints, Information Architecture (IA), SEO requirements, and accessibility rules defined in the OpenSpec documentation for the Fitdoctor.pl project.

## Source Documents
- `openspec/project.md` - High-level project goals and structure
- `openspec/opr/landing-home-mvp.md` - Detailed OPR (One Page Requirement) for landing page MVP

## Information Architecture (IA)

Based on `openspec/project.md`, the following routing structure is defined:

| Route | Purpose |
|-------|---------|
| `/` | Home (landing page) |
| `/oferta/` | Listing usług (services listing) |
| `/oferta/[slug]/` | Service details: dieta, trening, psychologia, terapia-hormonalna, suplementacja, recepty |
| `/pakiety/` | Pricing and bundling |
| `/zespol/` | Team listing |
| `/zespol/[slug]` | Individual team member details |
| `/blog/` | Blog articles listing |
| `/blog/[slug]` | Individual blog article |
| `/ankiety/` | Surveys index |
| `/ankiety/dieta` | Diet survey |
| `/ankiety/trening` | Training survey |
| `/ankiety/psychologia` | Psychology survey |
| `/kontakt/` | Contact form |
| `/konsultacja-lekarska/` | Medical consultation landing + CTA |

### Landing Page Structure (from `landing-home-mvp.md`)

Components organized in `src/components/landing/`:
- **Hero.tsx** - Main hero section
- **OfferTiles.tsx** - Service tiles
- **Pricing.tsx** - Pricing packages
- **TeamTeaser.tsx** - Team preview
- **Testimonials.tsx** - Client testimonials
- **BlogTeaser.tsx** - Blog preview
- **FAQ.tsx** - Frequently asked questions
- **FinalCTA.tsx** - Final call-to-action

Page composition in `src/app/page.tsx`

## SEO Requirements

### Meta Tags (NextSeo)
- Title tag with proper formatting
- Description meta tag
- Open Graph image placeholder (og:image)

### Structured Data (schema.org)
1. **Organization schema** (on `/`):
   - Name: Fitdoctor.pl
   - Logo
   - Contact point

2. **BreadcrumbList** for navigation hierarchy

### Content Structure
- **1 × H1** in Hero section only
- **H2** for all other section headings
- Proper heading hierarchy maintained

### Image Optimization
- Alt text required for all images
- Responsive image sizes
- `loading="lazy"` attribute for below-fold images

### Performance Target
- **Lighthouse score ≥ 90** for all metrics:
  - Performance
  - SEO
  - Accessibility
  - Best Practices

### Technical Optimizations
- Responsive images
- Preconnect to font sources
- Minimal JavaScript in static sections

## Accessibility Rules

### WCAG Compliance
- **Contrast ratio ≥ WCAG AA** standard for all text
- Focus-visible states on all interactive elements
- Keyboard navigation support

### UX Principles
- **Mobile-first** design approach
- Clickable entire tiles/cards (not just text or icon)
- ARIA labels where semantic HTML is insufficient

### Interactive Elements
- All CTAs must be keyboard accessible
- Form fields must have associated labels
- Focus indicators must be visible

### Content
- Professional, clear copy in Polish
- No "bro science" language
- Factual and evidence-based information

## Brand & Design

### Visual Identity
- Professional and clear aesthetic
- Medical/health-focused but approachable
- Trust-building through credibility

### Hero Section
- Strong claim/value proposition
- 2-3 primary action buttons:
  1. "Kup dietę" → `/oferta/dieta`
  2. "Kup trening" → `/oferta/trening`
  3. "Umów konsultację" → `/konsultacja-lekarska`

## Testing Requirements

### Playwright E2E Tests (Minimal)
1. Page loads and H1 is visible
2. All 3 CTAs are visible and functional
3. CTAs navigate to correct routes:
   - `/oferta/dieta`
   - `/oferta/trening`
   - `/konsultacja-lekarska`
4. Anchor scroll functionality (if implemented)

## Key Performance Indicators (KPI)

1. **CTR on main CTAs** (3 primary buttons)
2. **Survey form submissions** (diet/training/psychology)
3. **Scroll depth** on Home page
4. **Bounce rate** on Home page

## Technology Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **SEO**: next-seo package
- **Deployment**: Vercel
- **Forms**: Separate survey pages (diet/training/psychology)
- **Future**: Medusa/Stripe for checkout

## Acceptance Criteria Summary

From `landing-home-mvp.md`:
- [ ] All sections implemented: Hero, Offer, Pricing, Team, Testimonials, Blog, FAQ, Final CTA
- [ ] 3 primary CTAs functional and routing correctly
- [ ] Lighthouse score ≥ 90 for Performance/SEO/Accessibility/Best Practices
- [ ] Mobile-responsive with WCAG AA contrast
- [ ] Schema.org markup implemented (Organization, BreadcrumbList)
- [ ] Professional Polish copy without "bro science"
- [ ] E2E tests passing for critical user paths

---

**Acknowledged by**: AI Assistant  
**Date**: 2025-10-16  
**Purpose**: Documentation of constraints for OpenSpec-driven development

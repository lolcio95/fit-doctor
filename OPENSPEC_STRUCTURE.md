# OpenSpec Structure for FitDoctor

```
openspec/
│
├── 📄 project.md                    # Project Context & Conventions
│   ├── Purpose: FitDoctor fitness management platform
│   ├── Tech Stack: Next.js 15, TypeScript, Tailwind, Sanity CMS
│   ├── Conventions: Code style, architecture, testing, git workflow
│   ├── Domain Context: Fitness industry, content types, SEO focus
│   └── Dependencies: Sanity Cloud, Vercel, Unsplash, AI Assist
│
├── 📄 README.md                     # OpenSpec Workflow Guide
│   ├── Core concepts (specs, changes, project context)
│   ├── Workflow steps (review → propose → implement → test → archive)
│   ├── AI assistant integration
│   ├── Best practices
│   ├── Common commands
│   └── Troubleshooting
│
├── 📄 AGENTS.md                     # AI Instructions (auto-generated)
│   └── OpenSpec workflow for AI assistants
│
├── 📁 specs/                        # Main Specifications
│   │
│   ├── 📁 fitdoctor-web-app/
│   │   └── 📄 spec.md              # Application Specification
│   │       ├── Overview & Core Features
│   │       ├── Content Management (Sanity)
│   │       ├── Blog & Articles
│   │       ├── Team & Professionals
│   │       ├── Services Pages
│   │       ├── User Experience Features
│   │       ├── Technical Architecture
│   │       ├── Routing Structure
│   │       ├── Component Architecture
│   │       ├── Content Schema
│   │       ├── Page Builder Sections (10 types)
│   │       ├── SEO Strategy
│   │       ├── Performance Requirements
│   │       ├── Accessibility Requirements
│   │       ├── Deployment
│   │       └── Future Enhancements
│   │
│   └── 📁 technical-architecture/
│       └── 📄 spec.md              # Technical Architecture
│           ├── System Overview (JAMstack)
│           ├── Architecture Diagram
│           ├── Technology Stack Detail
│           ├── Styling Layer (Tailwind, Radix UI)
│           ├── Content Management Layer
│           ├── Data Flow Architecture
│           ├── File Structure
│           ├── Component Architecture
│           ├── Data Fetching Strategies
│           ├── API Integration
│           ├── Performance Optimization
│           ├── Security Considerations
│           ├── Monitoring & Analytics
│           ├── Development Workflow
│           ├── Deployment Pipeline
│           └── Scalability Considerations
│
└── 📁 changes/                      # Change Proposals
    │
    ├── 📁 enhance-fitdoctor-features/   # Active Change Proposal
    │   │
    │   ├── 📄 proposal.md          # Change Overview
    │   │   ├── Motivation
    │   │   ├── Proposed Changes:
    │   │   │   ├── 1. Enhanced Professional Profiles
    │   │   │   ├── 2. Advanced Blog Features
    │   │   │   ├── 3. Additional Page Builder Sections
    │   │   │   ├── 4. SEO Enhancements
    │   │   │   ├── 5. Performance Optimizations
    │   │   │   └── 6. User Engagement Features
    │   │   ├── Implementation Plan (5 phases)
    │   │   ├── Testing Strategy
    │   │   ├── Rollback Plan
    │   │   ├── Success Criteria
    │   │   └── Dependencies
    │   │
    │   ├── 📄 tasks.md             # Implementation Checklist
    │   │   ├── Phase 1: Schema Updates (7 tasks)
    │   │   ├── Phase 2: Component Development (19 tasks)
    │   │   ├── Phase 3: SEO & Performance (14 tasks)
    │   │   ├── Phase 4: Integration & Testing (14 tasks)
    │   │   ├── Phase 5: Documentation & Deployment (13 tasks)
    │   │   └── Success Checklist (12 items)
    │   │
    │   └── 📁 specs/               # Delta Specifications
    │       └── 📁 fitdoctor-web-app/
    │           └── 📄 spec.md      # Requirements Delta
    │               ├── ADDED Requirements:
    │               │   ├── Enhanced Professional Profiles (2 scenarios)
    │               │   ├── Blog Filtering & Taxonomy (3 scenarios)
    │               │   ├── Additional Page Builder Sections (4 scenarios)
    │               │   ├── Enhanced SEO Implementation (3 scenarios)
    │               │   └── User Engagement Forms (3 scenarios)
    │               ├── MODIFIED Requirements:
    │               │   ├── Page Performance (2 scenarios)
    │               │   └── Accessibility Standards (2 scenarios)
    │               ├── Implementation Notes
    │               ├── Testing Requirements
    │               └── Migration Strategy
    │
    └── 📁 archive/                 # Completed Changes (empty)


═══════════════════════════════════════════════════════════════════

Key Statistics:
├── 📊 Specifications: 2 (application + architecture)
├── 📊 Change Proposals: 1 active
├── 📊 Requirements: 7 ADDED + 2 MODIFIED = 9 total
├── 📊 Scenarios: 20 detailed test scenarios
├── 📊 Implementation Tasks: 100+ actionable tasks
└── 📊 Lines of Documentation: ~2,500 lines

Validation Status: ✅ All specifications validated successfully

Next Steps:
1. Review change proposal: openspec show enhance-fitdoctor-features
2. Begin implementation: Start with Phase 1 (Schema Updates)
3. Track progress: Update tasks.md as work is completed
4. Archive when done: openspec archive enhance-fitdoctor-features
```

## OpenSpec Commands Quick Reference

```bash
# View all specifications
openspec list --specs

# View all active changes
openspec list

# Show a specification
openspec spec show fitdoctor-web-app

# Show a change proposal
openspec show enhance-fitdoctor-features

# Validate a change
openspec validate enhance-fitdoctor-features

# Archive completed change
openspec archive enhance-fitdoctor-features

# Interactive dashboard
openspec view
```

## AI Assistant Integration

### Claude Code (Configured ✅)
Custom slash commands available:
- `/openspec proposal` - Create change proposal
- `/openspec apply` - Apply change
- `/openspec archive` - Archive completed change

### Universal AGENTS.md
Root AGENTS.md provides instructions for any AI assistant to:
- Understand OpenSpec structure
- Follow project conventions
- Reference specifications
- Create and implement changes

## FitDoctor Project Structure with OpenSpec

```
fit-doctor/
├── 📁 nextjs-app/              # Next.js Application
│   ├── app/                    # App Router pages
│   ├── components/             # React components
│   ├── sanity/                 # Sanity integration
│   └── ...
│
├── 📁 studio/                  # Sanity Studio
│   ├── src/schemaTypes/        # Content schemas
│   └── sanity.config.ts
│
├── 📁 openspec/                # OpenSpec (NEW! ✅)
│   ├── project.md              # Project context
│   ├── README.md               # Workflow guide
│   ├── specs/                  # Specifications
│   └── changes/                # Change proposals
│
├── 📁 .claude/                 # Claude Code config
│   └── commands/openspec/      # Custom commands
│
├── 📄 AGENTS.md                # Root AI instructions
├── 📄 CLAUDE.md                # Claude-specific instructions
├── 📄 OPENSPEC_SETUP.md        # Setup documentation
├── 📄 README.md                # Project README
└── 📄 package.json             # Workspace config
```

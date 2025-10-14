# OpenSpec Workflow Guide for FitDoctor

## Introduction
This guide explains how to use OpenSpec for developing the FitDoctor web application. OpenSpec provides a structured approach to specification-driven development with AI assistance.

## OpenSpec Structure

### Directory Layout
```
openspec/
├── AGENTS.md              # AI agent instructions (auto-managed)
├── project.md             # Project context and conventions
├── specs/                 # Main specifications
│   ├── fitdoctor-app.md          # Application specification
│   └── technical-architecture.md  # Technical architecture
├── changes/               # Change proposals
│   ├── enhance-fitdoctor-features/
│   │   └── proposal.md
│   └── archive/           # Completed changes
└── README.md              # This file
```

## Core Concepts

### 1. Specifications (specs/)
Main documentation describing the application:
- **Purpose**: Define what the application should do
- **Audience**: Developers, AI assistants, stakeholders
- **Maintenance**: Updated when completing changes
- **Examples**: Feature specs, architecture docs, API contracts

### 2. Change Proposals (changes/)
Specific, actionable changes to implement:
- **Purpose**: Define incremental improvements or features
- **Lifecycle**: Active → In Progress → Completed → Archived
- **Structure**: Problem, solution, implementation plan
- **Examples**: New features, bug fixes, refactorings

### 3. Project Context (project.md)
Shared knowledge about the project:
- Tech stack and dependencies
- Code conventions and style
- Architecture patterns
- Domain knowledge
- Important constraints

## Workflow

### Step 1: Review Specifications
Before starting work:
1. Read `openspec/project.md` for project context
2. Review relevant specs in `openspec/specs/`
3. Understand existing architecture and patterns

```bash
# View all specifications
openspec spec list

# View specific spec
openspec spec show fitdoctor-app
```

### Step 2: Create a Change Proposal
When adding a new feature or making significant changes:

1. **Create change directory**:
```bash
mkdir -p openspec/changes/your-feature-name
```

2. **Write proposal.md**:
```markdown
# Change Proposal: Your Feature Name

## Overview
Brief description of what you're changing

## Motivation
Why this change is needed

## Proposed Changes
Detailed list of modifications

## Implementation Plan
Step-by-step approach

## Testing Strategy
How to verify the change works

## Success Criteria
Clear definition of done
```

3. **Validate proposal**:
```bash
openspec validate your-feature-name
```

### Step 3: Implement the Change
Work with AI assistants to implement:

1. **Share context with AI**:
   - Point AI to the change proposal
   - Reference relevant specifications
   - Provide domain context

2. **Iterative development**:
   - Break work into small chunks
   - Test frequently
   - Commit regularly

3. **Follow conventions**:
   - Use TypeScript strict mode
   - Follow existing patterns
   - Write semantic HTML
   - Optimize for performance

### Step 4: Test & Validate
Ensure quality:

1. **Run type checking**:
```bash
cd nextjs-app && npm run typegen
npm run build
```

2. **Test locally**:
```bash
npm run dev
# Test at http://localhost:3000
```

3. **Check accessibility**:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

4. **Performance check**:
   - Lighthouse audit
   - Core Web Vitals
   - Image optimization

### Step 5: Archive the Change
Once completed and deployed:

1. **Move to archive**:
```bash
openspec archive your-feature-name
```

This command:
- Moves the change to `changes/archive/`
- Updates relevant specifications
- Marks the change as completed

2. **Update documentation**:
   - Update main specs if needed
   - Document any new patterns
   - Update project.md if conventions changed

## AI Assistant Integration

### Using Claude Code with OpenSpec

1. **Initial context**:
```
Please read openspec/project.md and review the specs in 
openspec/specs/ to understand the FitDoctor project.
```

2. **Create feature**:
```
I want to add [FEATURE]. Please create an OpenSpec change 
proposal at openspec/changes/[feature-name]/proposal.md
```

3. **Implement feature**:
```
Please implement the change proposal at 
openspec/changes/[feature-name]/proposal.md following 
the project conventions in openspec/project.md
```

4. **Review and refine**:
```
Please review the implementation against the change 
proposal and ensure all success criteria are met
```

### Universal AGENTS.md
The root `AGENTS.md` file provides instructions for AI assistants to:
- Understand the OpenSpec structure
- Follow project conventions
- Reference specifications when making changes
- Maintain consistency across the codebase

## Best Practices

### Specification Writing
- **Be specific**: Avoid ambiguity
- **Use examples**: Show, don't just tell
- **Keep updated**: Specs should reflect reality
- **Version control**: Track changes over time

### Change Proposals
- **One change per proposal**: Keep focused
- **Clear scope**: Define boundaries
- **Actionable steps**: Make it easy to implement
- **Success criteria**: Know when you're done

### Working with AI
- **Provide context**: Reference specs and proposals
- **Iterative refinement**: Break big tasks into smaller ones
- **Validate output**: Always review AI-generated code
- **Update specs**: Keep documentation current

### Code Quality
- **Type safety**: Use TypeScript strictly
- **Testing**: Write tests for critical paths
- **Performance**: Monitor Core Web Vitals
- **Accessibility**: Follow WCAG 2.1 AA
- **SEO**: Optimize for search engines

## Common Commands

### List all items
```bash
# List all active changes
openspec list

# List all specifications  
openspec list --specs
```

### View items
```bash
# View a change proposal
openspec show change-name

# View a specification
openspec spec show spec-name
```

### Validate
```bash
# Validate a change proposal
openspec validate change-name

# Validate a specification
openspec spec validate spec-name
```

### Interactive dashboard
```bash
# Open interactive view of all specs and changes
openspec view
```

### Archive completed work
```bash
# Archive a completed change
openspec archive change-name
```

## Troubleshooting

### Types not generating
```bash
cd studio
npm run extract-types
cd ../nextjs-app
npm run typegen
```

### Sanity Studio not loading
1. Check environment variables in `.env.local`
2. Verify Sanity project ID and dataset
3. Ensure read token is valid

### Build failures
1. Clear `.next` directory: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Check for TypeScript errors: `npm run build`

### Preview mode not working
1. Verify `SANITY_API_READ_TOKEN` is set
2. Check draft mode API route exists
3. Ensure presentation tool is configured

## Resources

### Documentation
- [OpenSpec Documentation](https://github.com/Fission-AI/OpenSpec)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)

### Tools
- **OpenSpec CLI**: Manage specs and changes
- **Sanity Studio**: Content management
- **Vercel**: Deployment platform
- **TypeScript**: Type safety

### Getting Help
1. Review existing specifications
2. Check change proposal templates
3. Consult project documentation
4. Ask team members
5. Use AI assistants with proper context

## Example: Adding a New Feature

### Scenario: Add a Testimonials Page

1. **Create change proposal**:
```bash
mkdir -p openspec/changes/testimonials-page
```

2. **Write proposal** (`openspec/changes/testimonials-page/proposal.md`):
```markdown
# Change Proposal: Testimonials Page

## Overview
Create a dedicated page displaying client testimonials
with filtering by service type.

## Proposed Changes
- Create Testimonial schema in Sanity
- Create /testimonials route in Next.js
- Build TestimonialCard component
- Add filtering UI
- Implement SEO metadata

## Implementation Plan
[Detailed steps...]

## Success Criteria
- Testimonials display correctly
- Filtering works as expected
- Page is mobile responsive
- SEO metadata is present
```

3. **Implement with AI**:
```
Please implement the testimonials page as described in
openspec/changes/testimonials-page/proposal.md
```

4. **Test and validate**:
```bash
npm run dev
# Test at http://localhost:3000/testimonials
```

5. **Archive when complete**:
```bash
openspec archive testimonials-page
```

## Conclusion
OpenSpec provides a structured workflow for building FitDoctor with AI assistance. By maintaining clear specifications and change proposals, you ensure consistent, high-quality development that aligns with project goals.

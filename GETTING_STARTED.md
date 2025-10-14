# Getting Started with FitDoctor OpenSpec

## 🎉 Welcome!

OpenSpec has been successfully set up for the FitDoctor web application! This guide will help you get started with spec-driven development using AI assistance.

## 📋 What You Have Now

### Complete OpenSpec Setup
✅ **Project Context** - Comprehensive project details, tech stack, and conventions  
✅ **Specifications** - Two main specs covering application features and technical architecture  
✅ **Change Proposal** - Detailed plan for enhancing FitDoctor with 9 new requirements  
✅ **Implementation Tasks** - 100+ actionable tasks organized in 5 phases  
✅ **Workflow Documentation** - Complete guide for using OpenSpec  
✅ **AI Integration** - Claude Code configured with custom commands  

### Documentation Files
- `OPENSPEC_SETUP.md` - Complete setup documentation
- `OPENSPEC_STRUCTURE.md` - Visual structure guide with command reference
- `openspec/README.md` - Comprehensive workflow guide
- `openspec/project.md` - Project context and conventions

## 🚀 Quick Start

### 1. Verify OpenSpec Installation

```bash
# Check OpenSpec version
openspec --version
# Should show: 0.12.0

# List specifications
openspec list --specs
# Should show: fitdoctor-web-app, technical-architecture

# List change proposals
openspec list
# Should show: enhance-fitdoctor-features

# Validate the change
openspec validate enhance-fitdoctor-features
# Should show: Change 'enhance-fitdoctor-features' is valid
```

### 2. Review Project Context

```bash
# Read the project context
cat openspec/project.md

# Or view it in your editor
code openspec/project.md  # VS Code
vim openspec/project.md   # Vim
```

**Key Information:**
- Purpose: Fitness and health management platform
- Tech Stack: Next.js 15, TypeScript, Tailwind CSS, Sanity CMS
- Architecture: JAMstack with embedded Sanity Studio
- Focus Areas: Content management, SEO, performance, accessibility

### 3. Explore Specifications

```bash
# View application specification
openspec spec show fitdoctor-web-app

# View technical architecture
openspec spec show technical-architecture
```

**What's Included:**
- Core features (home, blog, team, services)
- Page builder with 10 section types
- Content schema for pages, articles, people
- SEO and performance requirements
- Deployment setup

### 4. Review Change Proposal

```bash
# View the change proposal
openspec show enhance-fitdoctor-features

# Or read the files directly
cat openspec/changes/enhance-fitdoctor-features/proposal.md
cat openspec/changes/enhance-fitdoctor-features/tasks.md
cat openspec/changes/enhance-fitdoctor-features/specs/fitdoctor-web-app/spec.md
```

**What's Being Added:**
1. Enhanced professional profiles with specialties/certifications
2. Blog filtering by categories and tags
3. New page builder sections (stats, FAQ, video, pricing)
4. SEO enhancements (JSON-LD, Open Graph, Twitter Cards)
5. Performance optimizations (image loading, prefetching)
6. User engagement forms (contact, booking, newsletter)

## 💻 Development Workflow

### Working with AI Assistants

#### Claude Code (Configured ✅)
```
Please read openspec/project.md and familiarize yourself 
with the FitDoctor project. Then review the change proposal 
at openspec/changes/enhance-fitdoctor-features/proposal.md
```

#### Cursor / Other IDEs
```
Please read the following files to understand the project:
1. openspec/project.md - Project context
2. openspec/specs/fitdoctor-web-app/spec.md - Application spec
3. openspec/changes/enhance-fitdoctor-features/proposal.md - Current changes
```

### Implementation Flow

#### Step 1: Choose a Task
```bash
# View all tasks
cat openspec/changes/enhance-fitdoctor-features/tasks.md

# Start with Phase 1: Schema Updates
# Pick the first unchecked task
```

#### Step 2: Ask AI to Implement
```
Please implement the first task from Phase 1 in 
openspec/changes/enhance-fitdoctor-features/tasks.md:
"Add specialties array field to Person schema"

Follow the requirements in the delta specification at
openspec/changes/enhance-fitdoctor-features/specs/fitdoctor-web-app/spec.md
```

#### Step 3: Test the Implementation
```bash
# For schema changes
cd studio
npm run extract-types

cd ../nextjs-app
npm run typegen
npm run build

# Test locally
npm run dev
# Visit http://localhost:3333 (Sanity Studio)
```

#### Step 4: Update Task Checklist
```bash
# Mark the task as complete in tasks.md
# Change [ ] to [x] for completed tasks
```

#### Step 5: Commit Changes
```bash
git add .
git commit -m "Add specialties field to Person schema"
git push
```

### Repeat for Each Task
Continue with each task in the checklist, implementing one feature at a time.

## 📚 Common Scenarios

### Scenario 1: Understanding the Project
**Goal**: Get AI to understand the project before making changes

**Prompt**:
```
Please read and summarize the following:
1. openspec/project.md - What is the purpose and tech stack?
2. openspec/specs/fitdoctor-web-app/spec.md - What are the core features?
3. openspec/specs/technical-architecture/spec.md - How is it architected?
```

### Scenario 2: Implementing Schema Changes
**Goal**: Update Sanity schemas with new fields

**Prompt**:
```
Please implement the Person schema enhancements from 
openspec/changes/enhance-fitdoctor-features/tasks.md:

1. Add specialties array field to Person schema
2. Add certifications array field
3. Add availability/scheduling field
4. Add booking link URL field

Follow the requirements in the delta specification and 
maintain consistency with existing schema patterns.
```

### Scenario 3: Creating New Components
**Goal**: Build React components for new features

**Prompt**:
```
Please create the StatsCounter component as described in:
- openspec/changes/enhance-fitdoctor-features/proposal.md
- openspec/changes/enhance-fitdoctor-features/specs/fitdoctor-web-app/spec.md

Requirements:
- Use TypeScript with strict mode
- Use Tailwind CSS for styling
- Animate counters when scrolled into view
- Follow the existing component patterns in components/sections/
```

### Scenario 4: Adding SEO Features
**Goal**: Implement structured data for better SEO

**Prompt**:
```
Please implement JSON-LD structured data for Article pages 
as specified in the "Enhanced SEO Implementation" requirement 
of the delta specification.

The structured data should include:
- Article schema with author, datePublished, dateModified
- Image metadata
- ArticleBody content
- Validation against schema.org
```

### Scenario 5: Testing Changes
**Goal**: Verify implementation meets requirements

**Prompt**:
```
Please review the implementation of [FEATURE] against the 
requirements in openspec/changes/enhance-fitdoctor-features/
specs/fitdoctor-web-app/spec.md

Check that:
1. All scenarios are covered
2. Error handling is present
3. Accessibility is maintained
4. Performance is optimized
```

## 🔍 Useful Commands

### OpenSpec Commands
```bash
# List all items
openspec list              # Active changes
openspec list --specs      # Specifications

# Show details
openspec show enhance-fitdoctor-features    # Change proposal
openspec spec show fitdoctor-web-app        # Specification

# Validate
openspec validate enhance-fitdoctor-features

# Interactive view
openspec view

# Archive completed work
openspec archive enhance-fitdoctor-features
```

### Development Commands
```bash
# Install dependencies
npm install

# Start development servers
npm run dev
# Next.js: http://localhost:3000
# Sanity Studio: http://localhost:3333

# Generate types
cd studio && npm run extract-types
cd nextjs-app && npm run typegen

# Build for production
npm run build

# Import sample data
npm run import-sample-data
```

### Git Commands
```bash
# Check status
git status

# View changes
git diff

# Commit changes
git add .
git commit -m "Description of changes"
git push
```

## 📖 Documentation Structure

```
Documentation Hierarchy:
1. GETTING_STARTED.md (this file) ← START HERE
2. OPENSPEC_SETUP.md (setup details)
3. OPENSPEC_STRUCTURE.md (visual guide)
4. openspec/README.md (workflow guide)
5. openspec/project.md (project context)
```

## 🎯 Recommended Order of Reading

1. **This file** - Getting started overview
2. **openspec/project.md** - Understand the project
3. **openspec/specs/fitdoctor-web-app/spec.md** - Learn the features
4. **openspec/changes/enhance-fitdoctor-features/proposal.md** - Review changes
5. **openspec/README.md** - Learn the workflow

## ✅ Next Steps

1. **Understand the Project**
   - [ ] Read `openspec/project.md`
   - [ ] Review application specification
   - [ ] Review technical architecture

2. **Review the Change Proposal**
   - [ ] Read the proposal overview
   - [ ] Check implementation tasks
   - [ ] Understand requirements and scenarios

3. **Set Up Environment**
   - [ ] Install dependencies: `npm install`
   - [ ] Create `.env.local` files (if needed)
   - [ ] Test local development: `npm run dev`

4. **Start Implementation**
   - [ ] Begin with Phase 1: Schema Updates
   - [ ] Work through tasks sequentially
   - [ ] Test each change
   - [ ] Update task checkboxes

5. **Iterate and Improve**
   - [ ] Use AI to implement features
   - [ ] Test thoroughly
   - [ ] Update documentation
   - [ ] Archive when complete

## 🆘 Troubleshooting

### OpenSpec Not Found
```bash
# Reinstall globally
npm install -g @fission-ai/openspec@latest
```

### Validation Errors
```bash
# Check what's wrong
openspec validate enhance-fitdoctor-features

# Review delta spec format
cat openspec/changes/enhance-fitdoctor-features/specs/fitdoctor-web-app/spec.md
```

### Type Generation Fails
```bash
# Clean and regenerate
cd studio
rm -rf node_modules
npm install
npm run extract-types

cd ../nextjs-app
npm run typegen
```

### Build Errors
```bash
# Clear build cache
cd nextjs-app
rm -rf .next
npm run build
```

## 📞 Resources

- **OpenSpec Documentation**: https://github.com/Fission-AI/OpenSpec
- **Next.js Documentation**: https://nextjs.org/docs
- **Sanity Documentation**: https://www.sanity.io/docs
- **Project README**: README.md

## 🎉 You're Ready!

You now have everything you need to start building FitDoctor with OpenSpec!

**Recommended first action:**
```bash
# Review the change proposal
openspec show enhance-fitdoctor-features

# Then ask your AI assistant:
"Please read openspec/project.md and the change proposal at 
openspec/changes/enhance-fitdoctor-features/proposal.md, 
then help me implement Phase 1: Schema Updates"
```

Happy coding! 🚀

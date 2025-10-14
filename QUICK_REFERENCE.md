# FitDoctor OpenSpec Quick Reference

## 🚀 Getting Started in 3 Steps

### Step 1: Verify Setup
```bash
openspec --version           # Should show: 0.12.0
openspec list --specs        # Should show 2 specs
openspec validate enhance-fitdoctor-features  # Should pass
```

### Step 2: Read Documentation
Start with these files in order:
1. `GETTING_STARTED.md` - Your starting point
2. `openspec/project.md` - Project context
3. `openspec/changes/enhance-fitdoctor-features/proposal.md` - What to build

### Step 3: Begin Development
```bash
# Review tasks
cat openspec/changes/enhance-fitdoctor-features/tasks.md

# Start implementing Phase 1: Schema Updates
# Use your AI assistant with this prompt:
```

**Prompt for AI:**
```
Please read openspec/project.md to understand the FitDoctor project.
Then review openspec/changes/enhance-fitdoctor-features/proposal.md
and help me implement Phase 1: Schema Updates starting with the
first unchecked task in tasks.md
```

---

## 📋 Essential OpenSpec Commands

```bash
# View specifications
openspec list --specs               # List all specs
openspec spec show fitdoctor-web-app    # View app spec
openspec spec show technical-architecture  # View architecture

# View changes
openspec list                       # List active changes
openspec show enhance-fitdoctor-features   # View change details

# Validate
openspec validate enhance-fitdoctor-features  # Validate change

# Interactive view
openspec view                       # Dashboard of specs and changes

# Archive (when done)
openspec archive enhance-fitdoctor-features   # Archive completed work
```

---

## 💻 Development Commands

```bash
# Start development servers
npm run dev
# - Next.js: http://localhost:3000
# - Sanity Studio: http://localhost:3333

# Generate types (run after schema changes)
cd studio && npm run extract-types
cd ../nextjs-app && npm run typegen

# Build for production
npm run build

# Import sample data
npm run import-sample-data
```

---

## 📖 Documentation Index

| File | Purpose | Size |
|------|---------|------|
| `GETTING_STARTED.md` | Quick start guide | 11KB |
| `OPENSPEC_SETUP.md` | Setup documentation | 8.6KB |
| `OPENSPEC_STRUCTURE.md` | Visual structure guide | 8.1KB |
| `openspec/README.md` | Workflow guide | 8.6KB |
| `openspec/project.md` | Project context | 3.3KB |

---

## 🎯 What's in the Change Proposal

### 6 Major Enhancements (100+ tasks)

1. **Enhanced Professional Profiles**
   - Specialties and certifications
   - Availability and booking
   - Client testimonials

2. **Blog Filtering & Taxonomy**
   - Categories and tags
   - Related articles
   - Reading time
   - Social sharing

3. **New Page Builder Sections**
   - Stats counter (animated)
   - FAQ accordion
   - Video embeds
   - Pricing tables

4. **SEO Enhancements**
   - JSON-LD structured data
   - Open Graph tags
   - Twitter Cards
   - XML sitemap

5. **Performance Optimizations**
   - Blur placeholders
   - Route prefetching
   - Loading skeletons
   - Font optimization

6. **User Engagement Forms**
   - Contact form
   - Booking form
   - Newsletter signup

---

## 🔍 File Locations

### Specifications
```
openspec/specs/
├── fitdoctor-web-app/spec.md      # Application features
└── technical-architecture/spec.md  # System architecture
```

### Change Proposal
```
openspec/changes/enhance-fitdoctor-features/
├── proposal.md                     # Overview and plan
├── tasks.md                        # Implementation checklist
└── specs/fitdoctor-web-app/spec.md # Requirements delta
```

### Documentation
```
GETTING_STARTED.md         # Start here!
OPENSPEC_SETUP.md          # Setup details
OPENSPEC_STRUCTURE.md      # Visual guide
openspec/README.md         # Workflow guide
openspec/project.md        # Project context
```

---

## ✅ Implementation Workflow

1. **Choose a task** from `tasks.md`
2. **Ask AI to implement** with context from specs
3. **Test the change** locally
4. **Update checkbox** in `tasks.md` when done
5. **Commit and push** the changes
6. **Repeat** for next task

---

## 🤖 AI Assistant Prompts

### Understanding the Project
```
Please read and summarize:
1. openspec/project.md - Project context
2. openspec/specs/fitdoctor-web-app/spec.md - Features
3. openspec/specs/technical-architecture/spec.md - Architecture
```

### Implementing Features
```
Please implement [TASK NAME] from 
openspec/changes/enhance-fitdoctor-features/tasks.md

Follow the requirements in the delta specification at
openspec/changes/enhance-fitdoctor-features/specs/fitdoctor-web-app/spec.md

Maintain consistency with existing code patterns.
```

### Creating Components
```
Please create the [COMPONENT NAME] component as described in:
- openspec/changes/enhance-fitdoctor-features/proposal.md
- openspec/changes/enhance-fitdoctor-features/specs/fitdoctor-web-app/spec.md

Use TypeScript strict mode, Tailwind CSS, and follow existing patterns.
```

### Testing Implementation
```
Please review the [FEATURE] implementation against the requirements
in the delta specification. Verify all scenarios are covered.
```

---

## 🆘 Troubleshooting

### OpenSpec not found
```bash
npm install -g @fission-ai/openspec@latest
```

### Validation errors
```bash
openspec validate enhance-fitdoctor-features
# Fix any issues shown in the output
```

### Type generation fails
```bash
cd studio && rm -rf node_modules && npm install
npm run extract-types
cd ../nextjs-app && npm run typegen
```

### Build errors
```bash
cd nextjs-app && rm -rf .next && npm run build
```

---

## 📞 Resources

- **OpenSpec**: https://github.com/Fission-AI/OpenSpec
- **Next.js**: https://nextjs.org/docs
- **Sanity**: https://www.sanity.io/docs
- **Project README**: README.md

---

## 🎉 Quick Win

Run this to see your OpenSpec setup in action:

```bash
# View all specifications
openspec list --specs

# View the change proposal
openspec show enhance-fitdoctor-features

# Validate everything works
openspec validate enhance-fitdoctor-features
```

Expected output: Everything should pass! ✅

---

**Ready to start building?** Open `GETTING_STARTED.md` for detailed instructions!

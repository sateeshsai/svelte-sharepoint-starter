---
id: overview
label: Overview
description: Introduction to the Svelte + SharePoint starter codebase
keywords:
  - overview
  - intro
  - starter
  - beta
  - version
---

# Svelte + SharePoint Starter

**Version:** Beta 1.0.0  
**Last Updated:** January 2026

## What is This?

A production-ready **Svelte 5** starter codebase designed to accelerate web application development for **SharePoint 2013 on-premises hosting**. This is a meta-framework that provides battle-tested patterns, reusable utilities, and working examples to help development teams deliver high-quality applications faster.

---

## Why This Codebase Exists

### The Problem

Building web applications for SharePoint on-prem environments presents unique challenges:

- **No localhost development** - Can't connect to SharePoint REST API from localhost
- **Complex API patterns** - SharePoint REST API has quirks (FormDigest, LookUp columns, 5000-item limit)
- **Repetitive boilerplate** - Same patterns needed across multiple projects
- **Type safety gaps** - SharePoint responses need proper TypeScript types
- **Quality inconsistency** - Different developers implement similar features differently

### The Solution

This starter provides:

✅ **Offline-first development** - Work on localhost with mock data that mirrors production  
✅ **Type-safe patterns** - 100% TypeScript coverage with Zod schema validation  
✅ **Proven architecture** - Clean separation between reusable library and app code  
✅ **Working examples** - Real implementations you can learn from and copy  
✅ **Built-in best practices** - Error handling, analytics, state management, routing  
✅ **SharePoint expertise** - Handles FormDigest, LookUp columns, pagination, quirks  
✅ **Fast onboarding** - New developers can be productive in hours, not weeks

---

## Key Benefits for Your Team

### 1. **Faster Development**

- Start new projects in minutes instead of days
- Copy-paste working patterns instead of reinventing them
- Mock data lets you build UI before backend is ready

### 2. **Higher Quality**

- Consistent patterns across all team projects
- Type-safe from schemas to UI
- Built-in error handling and analytics
- Production-tested code

### 3. **Better Collaboration**

- Common vocabulary and patterns across team
- Easy to review code when everyone follows same conventions
- New team members onboard faster
- Reusable common-library reduces duplication

### 4. **SharePoint Made Easy**

- Abstracts away SharePoint complexity
- Handles pagination, LookUp columns, FormDigest automatically
- Mock/real data switching handled transparently
- Works with SharePoint 2013 on-prem constraints

---

## Codebase Structure

```
svelte-starter-2025/
│
├── public/                          # Static assets (deployed alongside HTML)
│   └── assets/
│       ├── docs/                    # Documentation (you are here)
│       ├── images/                  # App images
│       └── StoryFiles/              # Sample story attachments
│
├── src/
│   ├── lib/
│   │   ├── common-library/          ⭐ REUSABLE ACROSS PROJECTS
│   │   │   ├── integrations/
│   │   │   │   ├── sharepoint-rest-api/   # SharePoint data providers
│   │   │   │   ├── analytics/             # Analytics tracking
│   │   │   │   ├── error-handling/        # Error boundaries & reporting
│   │   │   │   └── router/                # Hash-based routing
│   │   │   └── utils/                     # String, date, file utilities
│   │   │
│   │   ├── data/                    🎯 APP-SPECIFIC
│   │   │   ├── schemas.ts                 # Zod schemas for your lists
│   │   │   ├── types.ts                   # TypeScript types derived from schemas
│   │   │   ├── global-state.svelte.ts     # App state
│   │   │   ├── local-data.ts              # Mock data for development
│   │   │   └── data-providers/            # Provider factory & mock provider
│   │   │
│   │   ├── env/                     ⚙️ CONFIGURATION
│   │   │   ├── sharepoint-config.ts       # List names, schemas, site paths
│   │   │   └── sharepoint-paths.ts        # Runtime path detection
│   │   │
│   │   ├── components/              📦 THIRD-PARTY UI
│   │   │   └── ui/                        # shadcn-svelte components
│   │   │
│   │   ├── hooks/                   🪝 CUSTOM HOOKS
│   │   │   ├── is-mobile.svelte.ts
│   │   │   └── useAbortController.svelte.ts
│   │   │
│   │   └── utils.ts                 # App-specific utilities
│   │
│   ├── routes/                      📄 APPLICATION PAGES
│   │   ├── index.svelte             # Home page
│   │   ├── stories/                 # Story list & detail pages
│   │   ├── admin/                   # Admin dashboard with charts
│   │   ├── docs/                    # Documentation viewer
│   │   └── markdown/                # Markdown rendering examples
│   │
│   ├── _components/                 # Shared app components
│   │   ├── Header.svelte
│   │   ├── Footer.svelte
│   │   └── ConfigErrorBoundary.svelte
│   │
│   ├── App.svelte                   # Root component
│   └── main.ts                      # Entry point
│
├── vite.config.ts                   # Build configuration
├── svelte.config.js                 # Svelte compiler config
├── components.json                  # shadcn-svelte config
└── package.json
```

---

## Architecture Layers

### 1. **Common Library Layer** (`src/lib/common-library/`)

**Purpose:** Code that can be reused across any team project

**Rules:**

- ❌ Never imports from app layer (`$lib/data`, `$lib/env`)
- ✅ Receives config via Svelte context or constructor params
- ✅ Generic, reusable implementations
- ✅ Can be extracted to npm package

**Contains:**

- SharePoint REST API functions & providers
- Analytics tracking system
- Error handling & reporting
- Router implementation
- Utility functions (string, date, file, etc.)

### 2. **Application Layer** (`src/lib/data/`, `src/lib/env/`, `src/routes/`)

**Purpose:** Project-specific implementation

**Rules:**

- ✅ Imports from common-library
- ✅ Defines project-specific schemas, types, config
- ✅ Implements concrete providers (extends base classes)
- ✅ Application routes and components

**Contains:**

- Your SharePoint list schemas
- Mock data for your lists
- App-specific state management
- Route pages and components
- Configuration for your environment

---

## Asset Linking Best Practice

Always link to assets using **relative paths starting with `./assets`** because the compiled HTML is colocated with the assets folder in production:

```svelte
<!-- ✅ CORRECT -->
<img src="./assets/images/logo.avif" alt="Logo" />
<video src="./assets/videos/demo.mp4" />

<!-- ❌ WRONG (won't work in production) -->
<img src="/assets/images/logo.avif" />
<img src="../public/assets/images/logo.avif" />
```

**Why?** SharePoint hosts the built `index.html` and `assets/` folder at the same level:

```
SharePoint Folder/
├── index.html          ← Your built app
└── assets/             ← Your static files
    ├── images/
    ├── videos/
    └── docs/
```

---

## Development vs Production

### Development (localhost)

- Uses **mock data** from `src/lib/data/local-data.ts`
- No SharePoint connection required
- Fast refresh, full Svelte DevTools
- Mock data persists in sessionStorage

### Production (SharePoint)

- Uses **SharePoint REST API** automatically
- No code changes needed
- Build outputs to `dist/` folder
- Deploy `dist/` contents to SharePoint folder

**Auto-detection:** The codebase automatically detects the environment based on hostname:

```typescript
export const LOCAL_MODE = hostname === "localhost" || hostname.startsWith("127.");
```

---

## Version Information

**Current Version:** Beta 1.0.0

### What "Beta" Means

- ✅ **Stable API** - Core patterns are established and documented
- ✅ **Production-ready** - Used in real projects with confidence
- ✅ **Comprehensive examples** - Everything you need to get started
- ✅ **Active development** - Regular improvements and bug fixes
- ⚠️ **Minor changes possible** - Edge case refinements may occur

### Upgrade Path

When we release new versions:

1. Review CHANGELOG for breaking changes
2. Update common-library code
3. Verify your schemas and types still work
4. Test with mock data first
5. Deploy to production

---

## Next Steps

Ready to get started? Continue to:

1. **[Getting Started](/docs/getting-started)** - Setup and first steps
2. **[Core Concepts](/docs/core-concepts)** - Understand the fundamentals
3. **[SharePoint Integration](/docs/sharepoint)** - Learn SharePoint patterns
4. **[Examples & Routes](/docs/examples)** - See working implementations

---

## Quick Reference

| Topic            | Link                                     |
| ---------------- | ---------------------------------------- |
| State Management | [/docs/state](/docs/state)               |
| API Integration  | [/docs/api](/docs/api)                   |
| Error Handling   | [/docs/errors](/docs/errors)             |
| Architecture     | [/docs/architecture](/docs/architecture) |
| Analytics        | [/docs/analytics](/docs/analytics)       |
| Utilities        | [/docs/utils](/docs/utils)               |
| Components       | [/docs/components](/docs/components)     |

---

## Support & Feedback

**Contact:** sateesh.modukuru@yourdomain.com  
**Status:** Beta 1.0.0 - Production Ready  
**Updates:** Check back regularly for improvements

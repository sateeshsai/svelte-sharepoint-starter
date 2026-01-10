# Svelte + SharePoint Starter

**Version:** Beta 1.0.0  
**Status:** Production Ready

A production-ready **Svelte 5** meta-framework for building web applications on **SharePoint 2013 on-premises**. Accelerate development with battle-tested patterns, offline-first development, and type-safe SharePoint integration.

---

## ✨ Key Features

- 🚀 **Offline-first development** - Build on localhost with mock data, deploy to SharePoint seamlessly
- 🔒 **100% type-safe** - TypeScript + Zod schemas from database to UI
- 🎯 **Provider pattern** - Abstract data layer switches between mock/SharePoint automatically
- 📦 **Batteries included** - Error handling, analytics, routing, state management built-in
- 🔧 **SharePoint expertise** - Handles FormDigest, LookUp columns, pagination, quirks
- 📚 **Comprehensive docs** - 13 detailed guides covering every aspect
- ⚡ **Modern stack** - Svelte 5 (runes), Vite, TailwindCSS v4, shadcn-svelte

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm check
```

**First time?** Read the [Getting Started Guide](public/assets/docs/01-getting-started.md)

---

## 📚 Documentation

Comprehensive guides available in [`public/assets/docs/`](public/assets/docs/):

### Essential Reading

- [**Overview**](public/assets/docs/00-overview.md) - What this is and why it exists
- [**Getting Started**](public/assets/docs/01-getting-started.md) - Setup and configuration
- [**Core Concepts**](public/assets/docs/02-core-concepts.md) - Fundamental patterns
- [**SharePoint Integration**](public/assets/docs/03-sharepoint.md) - REST API deep dive
- [**Examples & Routes**](public/assets/docs/04-examples.md) - Working implementations

### Development Guides

- [State Management](public/assets/docs/05-state-management.md)
- [API Integration](public/assets/docs/06-api-integration.md)
- [Error Handling](public/assets/docs/07-error-handling.md)
- [Architecture Layers](public/assets/docs/08-architecture-layers.md)
- [Analytics](public/assets/docs/09-analytics.md)
- [Utilities](public/assets/docs/10-utilities.md)
- [Components](public/assets/docs/11-components.md)
- [Config Validation](public/assets/docs/12-config-validation.md)

[**📖 Full Documentation Index**](public/assets/docs/index.md)

---

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── common-library/          # ⭐ Reusable across projects
│   │   ├── integrations/        # SharePoint, analytics, errors, router
│   │   └── utils/               # String, date, file helpers
│   ├── data/                    # 🎯 App-specific
│   │   ├── schemas.ts           # Zod schemas
│   │   ├── types.ts             # TypeScript types
│   │   ├── local-data.ts        # Mock data
│   │   └── data-providers/      # Provider factory
│   ├── env/                     # ⚙️ Configuration
│   │   └── sharepoint-config.ts # Lists, paths, schemas
│   └── components/ui/           # 📦 Third-party UI (shadcn)
└── routes/                      # 📄 Application pages
    ├── index.svelte             # Home
    ├── stories/                 # Story list & detail
    ├── admin/                   # Dashboard with charts
    └── docs/                    # Documentation viewer
```

---

## 🎯 Use Cases

Perfect for teams that need to:

✅ Build multiple SharePoint-hosted applications with consistent patterns  
✅ Develop offline without SharePoint connection  
✅ Onboard new developers quickly with working examples  
✅ Maintain type safety from database to UI  
✅ Share common utilities across projects  
✅ Deliver high-quality apps faster

---

## 🛠️ Tech Stack

- **Framework:** Svelte 5 (runes-only)
- **Build:** Vite (Rolldown)
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn-svelte, bits-ui
- **Validation:** Zod
- **Charts:** LayerChart
- **Backend:** SharePoint 2013 REST API
- **Development:** Mock data provider with session persistence

---

## 🤝 Contributing

This is an internal starter for team collaboration. When making improvements:

1. **Maintain layer separation** - common-library stays generic
2. **Update docs** - Keep guides in sync with code changes
3. **Add JSDoc comments** - Help others understand your patterns
4. **Test with mock data** - Verify changes work offline
5. **Run `pnpm check`** - Ensure type safety before committing

---

## 📞 Support

**Contact:** sateesh.modukuru@gmail.com  
**Status:** Beta 1.0.0 - Production Ready  
**Repository:** Internal team use

---

**Ready to build?** Start with the [Getting Started Guide](public/assets/docs/01-getting-started.md) →

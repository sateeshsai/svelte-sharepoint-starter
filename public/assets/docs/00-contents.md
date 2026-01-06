---
id: overview
label: Overview
description: Quick start, setup, and core concepts
keywords:
  - start
  - setup
  - install
  - architecture
  - files
  - routing
  - types
---

# Svelte + SharePoint Starter Documentation

## Overview

A production-ready meta-framework starter built with **Svelte 5**, **Vite**, and **TypeScript** for **SharePoint 2013 on-prem hosting**.

### Key Features

- **Type-Safe Routing** with SV Router
- **Offline-First Development** with LOCAL_MODE
- **Robust Error Handling** with Error Boundaries and automatic reporting
- **Async State Management** for forms and data loading
- **Global State** using Svelte 5 runes
- **SharePoint REST API** integration with request deduplication & cancellation
- **Rich Components** (Carousel, Rich Text Editor, Forms, Charts)
- **Analytics Tracking** built-in
- **Production-ready Examples** included

---

## Documentation

### Patterns & Architecture

1. **[Error Handling & Recovery](/docs/errors)** - Multi-layered error handling, boundaries, and reporting
2. **[State Management](/docs/state)** - Reactive state, async loading, and form submission
3. **[API Integration](/docs/api)** - SharePoint REST API with deduplication & cancellation
4. **[Analytics Tracking](/docs/analytics)** - Track user journeys and page visits

### Guides

5. **[Utilities Reference](/docs/utils)** - String, file, temporal, object utilities
6. **[Components & UI](/docs/components)** - Component library and styling
7. **[Working Examples](/docs/examples)** - Real-world implementations in codebase

---

## Quick Start

### Environment Setup

```ts
// src/lib/env/env.ts
export const SHAREPOINT_CONFIG = {
  site: "/sites/MyProject",
  lists: {
    Stories: "Stories",
    Files: "Files",
  },
};

export const LOCAL_MODE = hostname === "localhost" || hostname.startsWith("127."); // Auto-detected from hostname
```

### Schemas & Types

```ts
// Define schemas in src/lib/data/schemas.ts
export const StorySchema = z.object({
  Id: z.number(),
  Title: z.string(),
  Content: z.string(),
  Author: z.object({ Id: z.number(), Title: z.string() }),
});

// Derive types in src/lib/data/types.ts
export type Story_ListItem = z.infer<typeof StorySchema>;
```

### Fetching Data

```ts
import { getListItems } from "$lib/common-library/integrations/sharepoint-rest-api/get/getListItems";

const response = await getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title,Author/Id,Author/Title"],
    ["expand", "Author"],
    ["filter", "Active eq true"],
  ],
  dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS }, // Use fake data offline
  signal: abortController.signal,
});
```

### Async State Tracking

```ts
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";

const loadState = new AsyncLoadState();

$effect(() => {
  loadData();
});

async function loadData() {
  loadState.setLoading();
  try {
    const data = await getListItems({...});
    loadState.setReady();
  } catch (err) {
    loadState.setError(err.message, "PageLoad");
  }
}
```

### Error Boundaries

```svelte
<svelte:boundary>
  {#snippet failed(error, reset)}
    <ErrorBoundaryMessage
      customError="Failed to load content"
      {error}
      {reset}
    />
  {/snippet}

  <YourContent />
</svelte:boundary>
```

---

## Core Architecture

### Routing

Type-safe routing with SV Router. Generate links using `p()` function:

```ts
import { p } from "sv-router/generated";

href={p("/stories/:id", { params: { id: "123" } })}
```

### Data Flow

```
User Action
  ↓
Component (AsyncLoadState/AsyncSubmitState)
  ↓
API Call (with signal & LOCAL_MODE)
  ↓
SharePoint (or fake data in LOCAL_MODE)
  ↓
Error Boundary catches render errors
  ↓
Global State for user/session data
  ↓
Analytics tracks page visit
```

### Styling

- **Tailwind CSS 4** with plugins (forms, typography)
- **Dark mode** support via mode-watcher
- **Bits UI** components and LayerChart
- **Custom gradients** in src/lib/common-library/css/

---

## Common Patterns

### Form Submission

```ts
import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";

const submitState = new AsyncSubmitState();

async function handleSubmit(event: SubmitEvent) {
  submitState.setInprogress();
  try {
    const formData = new FormData(event.target as HTMLFormElement);
    await postNewStory(submitState, formData);
    submitState.setSuccess();
  } catch (err) {
    submitState.setError(err.message, "FormSubmission");
  }
}
```

### Loading Data with Error Handling

```ts
let stories: Story_ListItem[] | undefined = $state();
const loadState = new AsyncLoadState();

$effect(() => {
  loadStories();
});

async function loadStories() {
  loadState.setLoading();
  try {
    const response = await getListItems({
      listName: "Stories",
      dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
      signal,
    });
    stories = response.value;
    loadState.setReady();
  } catch (err) {
    loadState.setError(err.message, "StoryLoad");
  }
}
```

### Global State Usage

```ts
import { global_State, setCurrentUser } from "$lib/data/global-state.svelte";

// Set user
setCurrentUser(userData);

// Use in components
{#if global_State.user}
  Welcome, {global_State.user.Title}!
{/if}
```

---

## Examples in Codebase

- **[Home](/)** - Carousel, global state, welcome message
- **[Stories](/stories)** - Data loading, filtering, polling
- **[Story Detail](/stories/[id])** - Rich text editor, form submission, file gallery
- **[Admin Dashboard](/admin)** - Charts, sidebar navigation, analytics
- **[Markdown Examples](/markdown)** - Compile-time markdown with components

---

## Development

```bash
# Type checking
pnpm run check

# Dev server (detects LOCAL_MODE automatically)
pnpm run dev

# Generate routes
pnpm run gen-routes

# Build for SharePoint
pnpm run build

# Preview production build
pnpm run preview
```

---

## File Structure

```
src/
├── lib/
│   ├── data/
│   │   ├── schemas.ts          # Zod schemas (single source of truth)
│   │   ├── types.ts            # Derived types from schemas
│   │   ├── global-state.svelte.ts  # Global reactive state
│   │   ├── local-data.ts       # Mock data for LOCAL_MODE
│   ├── env/
│   │   └── env.ts              # SharePoint paths, feature flags
│   ├── common-library/
│   │   ├── integrations/
│   │   │   ├── sharepoint-rest-api/  # API calls & helpers
│   │   │   ├── error-handling/       # Error reporting
│   │   │   ├── analytics/            # Analytics tracking
│   │   ├── utils/
│   │   │   ├── async/           # AsyncLoadState, AsyncSubmitState
│   │   │   ├── functions/       # String, file, temporal utilities
│   │   ├── components/          # UI components (Carousel, RTE, etc.)
│   ├── components/              # Bits UI components
│   ├── hooks/                   # useAbortController, etc.
├── routes/
│   ├── +layout.svelte          # App layout
│   ├── index.svelte            # Home page
│   ├── stories/                # Stories list
│   ├── stories/[id]/           # Story detail & creation
│   ├── admin/                  # Admin dashboard
│   ├── markdown/               # Markdown examples
│   ├── docs/                   # This documentation
```

---

## Next Steps

1. Read through individual pattern guides for deep dives
2. Check out the examples in the codebase
3. Use LOCAL_MODE for offline development
4. Follow error handling patterns for reliability
5. Use AsyncLoadState/AsyncSubmitState for consistent UX

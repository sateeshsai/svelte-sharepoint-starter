---
id: examples
label: Examples & Routes
description: Working implementations demonstrating patterns and features
keywords:
  - examples
  - routes
  - implementation
  - demos
  - patterns
---

# Examples & Routes

Learn by exploring working implementations in the codebase. Each route demonstrates specific patterns you can study and adapt.

---

## Route Overview

| Route                               | Purpose         | Key Demonstrations                                |
| ----------------------------------- | --------------- | ------------------------------------------------- |
| [/](#home-page)                     | Home page       | Hero section, animated components, benefits list  |
| [/stories](#stories-list)           | Story list      | Filtering, polling, async loading, error handling |
| [/stories/:id](#story-detail)       | Story detail    | LookUp columns, file galleries, edit permissions  |
| [/stories/new](#create-story)       | Create story    | Form submission, file uploads, validation         |
| [/admin](#admin-dashboard)          | Admin dashboard | Charts, dashboard layout, role-based access       |
| [/admin/:category](#admin-category) | Category detail | Dynamic routing, sub-routes                       |
| [/docs](#documentation)             | Documentation   | Markdown rendering, navigation                    |
| [/markdown](#markdown-examples)     | Markdown demos  | Components in markdown, prose styling             |

---

## Home Page

**Route:** [/](../../src/routes/index.svelte)  
**Files:**

- [src/routes/index.svelte](../../src/routes/index.svelte)
- [src/routes/data.ts](../../src/routes/data.ts)
- [src/routes/\_components/Carousel_Stories.svelte](../../src/routes/_components/Carousel_Stories.svelte)

### What It Demonstrates

#### 1. Hero Section with Background Image

```svelte
<section
  class="w-full"
  style:background-image={`url(${"./assets/images/svelte-machine.avif"})`}
>
  <h1>Svelte + SharePoint</h1>
  <p>A meta-framework to accelerate development...</p>
</section>
```

**Key lessons:**

- ✅ Asset paths: `./assets/images/...`
- ✅ Inline styles with `style:` directive
- ✅ Responsive background sizing with Tailwind

#### 2. User Greeting with Global State

```svelte
{#if global_State.userProperties}
  <p in:fly={{ x: -20 }}>
    Welcome, {getUserFirstLastNames(global_State.userProperties).first}!
  </p>
{:else}
  <LoaderCircle class="animate-spin" />
{/if}
```

**Key lessons:**

- ✅ Access global state
- ✅ Loading state handling
- ✅ Animation with transitions
- ✅ Utility functions (`getUserFirstLastNames`)

#### 3. Viewport-Based Animations

```svelte
<script>
  import { IsInViewport } from "runed";

  let targetNode = $state<HTMLElement>()!;
  const inViewport = new IsInViewport(() => targetNode);
</script>

<div bind:this={targetNode}>
  {#if inViewport.current}
    <ul>
      {#each FRAMEWORK_FEATURES as benefit, idx}
        <li in:fly={{ y: -10, delay: 200 + idx * 100 }}>
          {benefit}
        </li>
      {/each}
    </ul>
  {/if}
</div>
```

**Key lessons:**

- ✅ Intersection Observer via `IsInViewport` rune
- ✅ Conditional rendering based on viewport
- ✅ Staggered animations with delay
- ✅ Performance optimization (render only when visible)

#### 4. Error Boundary

```svelte
<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage
      customError="Error rendering home page."
      {error}
      {reset}
    />
  {/snippet}
  <!-- page content -->
</svelte:boundary>
```

**Key lessons:**

- ✅ Wrap entire page in error boundary
- ✅ Custom error messages
- ✅ Reset functionality
- ✅ Prevents entire app from crashing

#### 5. Video Background with Overlay

```svelte
<div class="videoWrapper grid">
  <video
    muted
    autoplay
    src="./assets/videos/Batteries_941611483.mp4"
    class="col-start-1 row-start-1"
  >
    <track kind="captions" />
  </video>
  <div class="overlay col-start-1 row-start-1 bg-gradient-to-r from-white/90">
    <h2>Batteries-included!</h2>
    <p>Everything you need...</p>
  </div>
</div>
```

**Key lessons:**

- ✅ Grid overlay technique
- ✅ Video backgrounds
- ✅ Gradient overlays for readability
- ✅ Accessibility (track for captions)

#### 6. Analytics Tracking

```svelte
<script>
  import { trackAnalytics } from "$lib/common-library/integrations/analytics";
  trackAnalytics();  // Automatically tracks page view
</script>
```

**Key lessons:**

- ✅ Simple analytics integration
- ✅ Automatic page view tracking
- ✅ No manual setup needed

---

## Stories List

**Route:** [/stories](../../src/routes/stories/index.svelte)  
**Files:**

- [src/routes/stories/index.svelte](../../src/routes/stories/index.svelte)
- [src/routes/stories/get.svelte.ts](../../src/routes/stories/get.svelte.ts)
- [src/routes/stories/\_components/Stories.svelte](../../src/routes/stories/_components/Stories.svelte)
- [src/routes/stories/\_components/StoryFilters.svelte](../../src/routes/stories/_components/StoryFilters.svelte)

### What It Demonstrates

#### 1. Polling with Cache Control

```typescript
let lastFetchTimeString: string | undefined;
const pollInterval = LOCAL_MODE ? 2000 : 10000;

stopPolling = poll(async () => {
  const currentFetchTimeString = new Date().toISOString();
  const storiesFromDB = await getStories(storiesLoadState, lastFetchTimeString, signal, false);

  if (storiesFromDB === undefined || storiesLoadState.error) {
    stopPolling();
    return;
  }

  lastFetchTimeString = currentFetchTimeString;
  stories = stories ? [...stories, ...storiesFromDB] : storiesFromDB;
}, pollInterval);
```

**Key lessons:**

- ✅ Polling for real-time updates
- ✅ Timestamp-based incremental loading
- ✅ Different intervals for dev/prod (2s vs 10s)
- ✅ Stop polling on error
- ✅ Append new items to existing array

#### 2. Client-Side Filtering with $derived

```typescript
let storiesToShow = $derived(
  stories?.filter((story) => {
    const tagsFilterValidate = !filters.Tags.selected.length || filters.Tags.selected.reduce((acc, selectedTag) => (story.Tags.toLowerCase().includes(selectedTag.toLowerCase()) ? true : acc), false);

    const yearFilterValidate = !filters.Year.selected.length || filters.Year.selected.reduce((acc, selectedYear) => (new Date(story.Created).getFullYear() === +selectedYear ? true : acc), false);

    return tagsFilterValidate && yearFilterValidate;
  })
);
```

**Key lessons:**

- ✅ Reactive filtering with `$derived`
- ✅ Multiple filter criteria
- ✅ Case-insensitive string matching
- ✅ Date parsing for year filtering
- ✅ Performance (client-side filtering)

#### 3. Dynamic Filter Generation

```typescript
const filters = $derived.by(() => {
  const _filters = $state({
    Tags: {
      category: "Tags",
      options: [...new Set(stories?.map((s) => s.Tags?.replaceAll(" ", "").split(",")).flat())],
      selected: [],
    },
    Year: {
      category: "Year",
      options: [...new Set(stories?.map((s) => new Date(s.Modified).getFullYear().toString()))],
      selected: [],
    },
  });
  return _filters;
});
```

**Key lessons:**

- ✅ Generate filters from data
- ✅ Use `Set` for unique values
- ✅ Parse and transform data (tags → array, date → year)
- ✅ Reactive filter options
- ✅ `$derived.by` for complex derivations

#### 4. Filter UI in Sheet

```svelte
<Sheet.Root>
  <Sheet.Trigger asChild let:builder>
    <Button builders={[builder]}>
      <ListFilter class="h-3.5 w-3.5" />
      <span>Filter</span>
    </Button>
  </Sheet.Trigger>
  <Sheet.Content side="left">
    <StoryFilters bind:filters />
  </Sheet.Content>
</Sheet.Root>
```

**Key lessons:**

- ✅ Sheet component for filters (mobile-friendly)
- ✅ Two-way binding (`bind:filters`)
- ✅ Lucide icons integration
- ✅ Trigger as child pattern

#### 5. Abort Controller Hook

```typescript
import { useAbortController } from "$lib/hooks/useAbortController.svelte";

const { signal } = useAbortController();

// Pass signal to all requests
await getStories(storiesLoadState, lastFetchTimeString, signal, false);
```

**Key lessons:**

- ✅ Automatic request cancellation on unmount
- ✅ Reusable hook pattern
- ✅ Prevents memory leaks
- ✅ Pass signal to all async operations

---

## Story Detail

**Route:** [/stories/:id](../../src/routes/stories/[id]/index.svelte)  
**Files:**

- [src/routes/stories/[id]/index.svelte](../../src/routes/stories/[id]/index.svelte)
- [src/routes/stories/[id]/get.svelte.ts](../../src/routes/stories/[id]/get.svelte.ts)
- [src/routes/stories/[id]/\_components/StoryFileGallery.svelte](../../src/routes/stories/[id]/_components/StoryFileGallery.svelte)

### What It Demonstrates

#### 1. Route Parameters

```typescript
import { route } from "sv-router/generated";

const params = $derived(route.getParams("/stories/:id"));
const storyId = $derived(params.id.toLowerCase() === "new" || params.id.toLowerCase() === "create" ? undefined : params.id);
```

**Key lessons:**

- ✅ Extract route parameters
- ✅ Handle special values ("new", "create")
- ✅ Reactive parameter updates
- ✅ Type-safe routing

#### 2. Multiple Async Load States

```typescript
let storyLoadState = new SharePointAsyncLoadState();
let storyFilesLoadState = new SharePointAsyncLoadState();

$effect(() => {
  loadData();
});

$effect(() => {
  loadStoryFiles(storyId);
});
```

**Key lessons:**

- ✅ Separate load states for different data
- ✅ Independent loading lifecycle
- ✅ Multiple `$effect` blocks
- ✅ Dependent data loading

#### 3. LookUp Column Expansion

```typescript
// In get.svelte.ts
const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title,Content,Author/Id,Author/Title"],
    ["expand", "Author"], // Required for LookUp!
    ["filter", `Id eq ${storyId}`],
    ["top", 1],
  ],
  signal,
});
```

**Key lessons:**

- ✅ Expand LookUp columns
- ✅ Select specific LookUp fields
- ✅ Filter by ID
- ✅ Limit to one result with `top`

#### 4. Permission-Based UI

```typescript
import { canEditItem } from "$lib/data/global-state.svelte";

const currentUserCanEdit = $derived(canEditItem(story?.Author?.Id));
```

```svelte
{#if currentUserCanEdit}
  <a href={p("/stories/:id/edit", { id: story.Id })}>
    <PenLine class="h-3.5 w-3.5" />
    <span>Edit</span>
  </a>
{/if}
```

**Key lessons:**

- ✅ Role-based UI rendering
- ✅ Check author ownership
- ✅ Derived permissions
- ✅ Admin override logic

#### 5. File Gallery with Parent Filter

```typescript
// Fetch files for specific story
const storyFiles = await provider.getListItems({
  listName: "StoryFiles",
  operations: [
    ["select", "Id,Title,Description,FileOrder,Parent/Id"],
    ["expand", "Parent"],
    ["filter", `ParentId eq ${storyId}`],
    ["orderby", "FileOrder asc"],
  ],
  signal,
});
```

**Key lessons:**

- ✅ Filter by parent relationship
- ✅ Order files by custom field
- ✅ Handle one-to-many relationships
- ✅ LookUp column filtering

#### 6. Breadcrumb Navigation

```svelte
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href={p("/stories")}>Stories</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>{story?.Title}</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

**Key lessons:**

- ✅ Breadcrumb component usage
- ✅ Navigation hierarchy
- ✅ Dynamic current page
- ✅ Hash-based routing with `p()`

---

## Create Story

**Route:** [/stories/new](../../src/routes/stories/[id]/index.svelte)  
**Files:**

- [src/routes/stories/[id]/index.svelte](../../src/routes/stories/[id]/index.svelte) (same as detail)
- [src/routes/stories/[id]/post.ts](../../src/routes/stories/[id]/post.ts)

### What It Demonstrates

#### 1. Auto-Redirect for New Items

```typescript
const storyId = $derived(params.id.toLowerCase() === "new" || params.id.toLowerCase() === "create" ? undefined : params.id);

$effect(() => {
  if (!storyId) {
    postNewStory(newStorySubmitState);
  }
});

async function postNewStory(submitState: SharePointAsyncSubmitState) {
  submitState.setInprogress();

  const newStory = {
    Title: `New Story ${Date.now()}`,
    Content: "Start writing...",
    Status: "Draft",
    Tags: "",
  };

  const response = await provider.postListItem({
    listName: "Stories",
    body: newStory,
  });

  if (!("error" in response)) {
    navigate(`/stories/${response.Id}`, { replace: true });
  }
}
```

**Key lessons:**

- ✅ Auto-create pattern
- ✅ Redirect after creation
- ✅ Default values for new items
- ✅ Timestamp for unique titles
- ✅ `replace: true` to avoid back button issues

#### 2. Form Submission State

```typescript
const newStorySubmitState = new SharePointAsyncSubmitState();

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  newStorySubmitState.setInprogress();

  try {
    const formData = new FormData(event.target as HTMLFormElement);
    await saveStory(formData);
    newStorySubmitState.setSuccess();
  } catch (err) {
    newStorySubmitState.setError(err.message, "StorySubmission");
  }
}
```

**Key lessons:**

- ✅ Track submission lifecycle
- ✅ FormData API
- ✅ Auto-report errors to SharePoint
- ✅ Success state handling

---

## Admin Dashboard

**Route:** [/admin](../../src/routes/admin/index.svelte)  
**Files:**

- [src/routes/admin/index.svelte](../../src/routes/admin/index.svelte)
- [src/routes/admin/\_components/\_charts/BarChart.svelte](../../src/routes/admin/_components/_charts/BarChart.svelte)
- [src/routes/admin/\_components/\_charts/LineChart.svelte](../../src/routes/admin/_components/_charts/LineChart.svelte)
- [src/routes/admin/\_components/\_charts/DonutChart.svelte](../../src/routes/admin/_components/_charts/DonutChart.svelte)
- [src/routes/admin/\_components/\_charts/AreaChart.svelte](../../src/routes/admin/_components/_charts/AreaChart.svelte)

### What It Demonstrates

#### 1. Dashboard Grid Layout

```svelte
<div class="grid auto-rows-max gap-4 md:grid-cols-3">
  <div class="bg-muted/50 aspect-video rounded-xl">
    <BarChart />
  </div>
  <div class="bg-muted/50 aspect-video rounded-xl">
    <LineChart />
  </div>
  <div class="bg-muted/50 aspect-video rounded-xl">
    <DonutChart />
  </div>
</div>
<div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min p-4">
  <AreaChart />
</div>
```

**Key lessons:**

- ✅ Responsive grid layout
- ✅ Aspect ratio for charts
- ✅ Auto-rows for dynamic height
- ✅ Full-width chart section

#### 2. Chart Components

Each chart component demonstrates:

- ✅ Data visualization patterns
- ✅ Responsive chart sizing
- ✅ Theming support
- ✅ Loading states

#### 3. Role-Based Access

```typescript
// In layout or route guard
if (!isAdmin) {
  navigate("/", { replace: true });
}
```

**Key lessons:**

- ✅ Protect admin routes
- ✅ Check access role
- ✅ Redirect unauthorized users
- ✅ Server-side validation needed in production

---

## Admin Category Detail

**Route:** [/admin/:category](../../src/routes/admin/[category]/index.svelte)  
**Files:**

- [src/routes/admin/[category]/index.svelte](../../src/routes/admin/[category]/index.svelte)

### What It Demonstrates

#### 1. Nested Dynamic Routes

```typescript
const params = $derived(route.getParams("/admin/:category"));
const category = $derived(params.category);
```

**Key lessons:**

- ✅ Sub-routes with parameters
- ✅ Category-specific views
- ✅ Shared layout inheritance

---

## Documentation

**Route:** [/docs](../../src/routes/docs/index.svelte)  
**Files:**

- [src/routes/docs/index.svelte](../../src/routes/docs/index.svelte)
- [src/routes/docs/layout.svelte](../../src/routes/docs/layout.svelte)
- [src/routes/docs/get.svelte.ts](../../src/routes/docs/get.svelte.ts)
- [src/routes/docs/[section]/index.svelte](../../src/routes/docs/[section]/index.svelte)

### What It Demonstrates

#### 1. Dynamic Markdown Loading

```typescript
import { marked } from "marked";

async function renderDocSection(section: DocSection, loadState: LoadState) {
  loadState.setLoading();

  try {
    const response = await fetch(`./assets/docs/${section.file}.md`);
    const markdown = await response.text();
    const html = marked.parse(markdown);
    loadState.setReady();
    return html;
  } catch (err) {
    loadState.setError(err.message);
  }
}
```

**Key lessons:**

- ✅ Dynamic content loading
- ✅ Markdown parsing with marked
- ✅ Asset path references
- ✅ Error handling for missing files

#### 2. Sidebar Navigation

```svelte
<aside class="sidebar">
  {#each sections as section}
    <a
      href={`#/docs/${section.id}`}
      class:active={currentSection === section.id}
    >
      {section.label}
    </a>
  {/each}
</aside>
```

**Key lessons:**

- ✅ Dynamic navigation from config
- ✅ Active state tracking
- ✅ Hash-based internal links

#### 3. Prose Styling

```svelte
<div class="prose-sm sm:prose mx-auto dark:prose-invert max-w-4xl">
  {@html htmlContent}
</div>
```

**Key lessons:**

- ✅ Tailwind Typography plugin
- ✅ Dark mode support
- ✅ Responsive prose sizes
- ✅ Safe HTML rendering

---

## Markdown Examples

**Route:** [/markdown](../../src/routes/markdown/index.svelte)  
**Files:**

- [src/routes/markdown/index.svelte](../../src/routes/markdown/index.svelte)
- [src/routes/markdown/\_components-in-markdown.md](../../src/routes/markdown/_components-in-markdown.md)
- [src/routes/markdown/\_simple-markdown.md](../../src/routes/markdown/_simple-markdown.md)
- [src/routes/markdown/Counter.svelte](../../src/routes/markdown/Counter.svelte)

### What It Demonstrates

#### 1. Import Markdown as Components

```svelte
<script>
  import ComponentsInMarkdown from "./_components-in-markdown.md";
  import SimpleMarkdown from "./_simple-markdown.md";
</script>

<h1>Simple Markdown</h1>
<SimpleMarkdown />

<h1>Components in Markdown</h1>
<ComponentsInMarkdown />
```

**Key lessons:**

- ✅ Markdown files as Svelte components (via mdsvex)
- ✅ Multiple markdown imports
- ✅ Wrapper components for markdown

#### 2. Svelte Components in Markdown

```markdown
<!-- In _components-in-markdown.md -->
<script>
  import Counter from "./Counter.svelte";
</script>

# Interactive Components in Markdown

Here's a counter component:

<Counter />

And some more markdown content...
```

**Key lessons:**

- ✅ Mix markdown and Svelte components
- ✅ Interactive content in docs
- ✅ Component imports in markdown
- ✅ Full Svelte features available

---

## Common Patterns Across Routes

### Pattern 1: Async Loading Template

Every route follows this pattern:

```svelte
<script>
  const loadState = new SharePointAsyncLoadState();
  let data = $state();

  $effect(() => {
    loadData();
  });

  async function loadData() {
    loadState.setLoading();
    try {
      data = await fetchData();
      loadState.setReady();
    } catch (err) {
      loadState.setError(err.message);
    }
  }
</script>

{#if loadState.loading}
  <StatusMessage type="loading" />
{:else if loadState.error}
  <StatusMessage type="error" message={loadState.error} />
{:else if loadState.ready}
  <DataDisplay {data} />
{/if}
```

### Pattern 2: Error Boundaries

Every page wrapped in boundary:

```svelte
<svelte:boundary>
  {#snippet failed(error, reset)}
    <ErrorBoundaryMessage
      customError="Error rendering [page]."
      {error}
      {reset}
    />
  {/snippet}
  <!-- page content -->
</svelte:boundary>
```

### Pattern 3: Analytics Tracking

Every route tracks page views:

```svelte
<script>
  import { trackAnalytics } from "$lib/common-library/integrations/analytics";
  trackAnalytics();
</script>
```

### Pattern 4: Abort Controller

Every route that fetches data:

```svelte
<script>
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";
  const { signal } = useAbortController();

  await provider.getListItems({ listName, signal });
</script>
```

---

## Comparison Table

| Feature           | Home      | Stories List | Story Detail     | Admin      |
| ----------------- | --------- | ------------ | ---------------- | ---------- |
| Async Loading     | ✅        | ✅           | ✅               | ✅         |
| Error Boundary    | ✅        | ✅           | ✅               | ✅         |
| Analytics         | ✅        | ✅           | ✅               | ✅         |
| Global State      | ✅ (user) | ❌           | ✅ (permissions) | ✅ (admin) |
| Polling           | ❌        | ✅           | ❌               | ❌         |
| Filtering         | ❌        | ✅           | ❌               | ❌         |
| LookUp Columns    | ❌        | ✅           | ✅               | ❌         |
| File Handling     | ❌        | ❌           | ✅               | ❌         |
| Form Submission   | ❌        | ❌           | ✅               | ❌         |
| Charts            | ❌        | ❌           | ❌               | ✅         |
| Role-Based Access | ❌        | ❌           | ✅ (edit)        | ✅ (view)  |

---

## Learning Path

**Beginner:** Start with these routes

1. [Home](#home-page) - Basic patterns
2. [Stories List](#stories-list) - Data fetching
3. [Story Detail](#story-detail) - LookUp columns

**Intermediate:** Move to these 4. [Create Story](#create-story) - Form handling 5. [Admin Dashboard](#admin-dashboard) - Layouts & charts 6. [Documentation](#documentation) - Dynamic content

**Advanced:** Explore these 7. Polling implementation in Stories List 8. Permission system in Story Detail 9. Intersection Observer in Home 10. Mock data providers

---

## Next Steps

- **[State Management](/docs/state)** - Deep dive into async patterns
- **[Error Handling](/docs/errors)** - Error boundaries & reporting
- **[API Integration](/docs/api)** - Provider patterns
- **[SharePoint Integration](/docs/sharepoint)** - API details

---

## Quick Reference

| To Learn            | Study This Route |
| ------------------- | ---------------- |
| Basic data fetching | Stories List     |
| LookUp columns      | Story Detail     |
| Forms & validation  | Create Story     |
| Polling             | Stories List     |
| Filtering           | Stories List     |
| Permissions         | Story Detail     |
| Charts              | Admin Dashboard  |
| Markdown rendering  | Documentation    |
| Animations          | Home Page        |
| Error boundaries    | Any route        |

**Pro tip:** Open the route files while viewing the live demo to understand how code translates to UI!

---
id: examples
label: Examples
description: Working implementations and real-world patterns
keywords:
  - example
  - pattern
  - home
  - stories
  - admin
  - implementation
---

# Working Examples in Codebase

Learn by exploring production-ready implementations. Each example demonstrates patterns from [State Management](/docs/state), [API Integration](/docs/api), and [Error Handling](/docs/errors).

---

## Home Page

**Route:** `/` (root)  
**File:** `src/routes/index.svelte`

### Features Demonstrated

- **Carousel Component** - Image carousel with Embla
- **Global State** - Display user welcome message using `global_State.userProperties`
- **Animations** - Svelte transitions (fly, fade, slide, scale)
- **Analytics** - Automatic page visit tracking
- **Responsive Layout** - Mobile-first design with video backgrounds
- **Error Boundaries** - Wrapped in `<svelte:boundary>`

### Key Code Patterns

```svelte
<script lang="ts">
  import Carousel_Stories from "./_components/Carousel_Stories.svelte";
  import { global_State } from "$lib/data/global-state.svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import { IsInViewport } from "runed"; // Intersection observer

  trackAnalytics(); // Track page visit

  let targetNode = $state<HTMLElement>()!;
  const inViewport = new IsInViewport(() => targetNode); // Viewport detection
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage {error} {reset} />
  {/snippet}

  {#if global_State.userProperties}
    <p>Welcome, {getUserFirstLastNames(global_State.userProperties).first}!</p>
  {/if}

  <Carousel_Stories />
</svelte:boundary>
```

### What to Learn

- How to use global state reactively (see [State Management](/docs/state))
- Carousel implementation with type-safe routing (see [Components](/docs/components))
- Error boundary wrapping (see [Error Handling](/docs/errors))
- [Analytics tracking](/docs/analytics) at page level
- Viewport detection for animations

---

## Stories List

**Route:** `/stories`  
**File:** `src/routes/stories/index.svelte`

### Features Demonstrated

- **Data Loading** - [AsyncLoadState](/docs/state) for tracking loading/ready/error states
- **Request Cancellation** - [useAbortController](/docs/api) for cleanup on unmount
- **Polling** - Continuous polling with `poll()` utility
- **Filtering** - Dynamic filter UI with multiple criteria
- **[Error Handling](/docs/errors)** - Status messages and error boundaries
- **Type-Safe Routing** - p() function for links

### Key Code Patterns

```svelte
<script lang="ts">
  import { getStories } from "./get.svelte";
  import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";
  import { poll } from "$lib/common-library/integrations/sharepoint-rest-api/utilities/helpers";

  const { signal } = useAbortController(); // Auto-cancel on unmount
  let storiesLoadState = new AsyncLoadState();

  onMount(() => {
    loadStories();
    return stopPolling; // Cleanup polling on unmount
  });

  async function loadStories() {
    let lastFetchTimeString: string | undefined;

    // Poll every 2 seconds for new stories
    stopPolling = poll(async () => {
      const storiesFromDB = await getStories(
        storiesLoadState,
        lastFetchTimeString,
        signal
      );
      lastFetchTimeString = new Date().toISOString();

      if (!storiesFromDB || storiesLoadState.error) {
        stopPolling();
        return;
      }

      stories = stories ? [...stories, ...storiesFromDB] : storiesFromDB;
    }, 2000);
  }

  // Dynamic derived filtering
  let storiesToShow = $derived(
    stories?.filter((story) => {
      const tagsMatch =
        !filters.Tags.selected.length ||
        filters.Tags.selected.some((tag) =>
          story.Tags.toLowerCase().includes(tag.toLowerCase())
        );
      const yearMatch =
        !filters.Year.selected.length ||
        filters.Year.selected.some(
          (year) => new Date(story.Created).getFullYear() === +year
        );
      return tagsMatch && yearMatch;
    })
  );
</script>

{#if storiesLoadState.loading}
  <LoadingSpinner />
{:else if storiesLoadState.error}
  <StatusMessage type="error" message={storiesLoadState.error} />
{:else if storiesLoadState.ready}
  <Stories {storiesToShow} />
{/if}
```

### What to Learn

- AsyncLoadState lifecycle management
- useAbortController hook for request cleanup
- Polling pattern with interval
- Dynamic filtering with derived values
- Reactive data updates

---

## Story Detail & Creation

**Route:** `/stories/[id]` (detail) or `/stories/new` (create)  
**File:** `src/routes/stories/[id]/index.svelte`

### Features Demonstrated

- **Form Submission** - AsyncSubmitState for tracking submission states
- **Rich Text Editor** - Tiptap WYSIWYG with Markdown support
- **File Gallery** - Multiple file display and management
- **Authorization** - Role-based editing (Admin or Author only)
- **Breadcrumb Navigation** - Navigation context display
- **Request Cancellation** - AbortController with effect cleanup
- **POST/PUT Operations** - Creating and updating SharePoint items

### Key Code Patterns

```svelte
<script lang="ts">
  import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";
  import { global_State } from "$lib/data/global-state.svelte";
  import { route } from "sv-router/generated";

  const { signal } = useAbortController();
  const params = $derived(route.getParams("/stories/:id"));
  const storyId = $derived(
    params.id.toLowerCase() === "new" ? undefined : params.id
  );

  let storyLoadState = new AsyncLoadState();
  let newStorySubmitState = new AsyncSubmitState();
  let userCanEdit = $derived(
    global_State.AccessRole === "Admin" ||
      story?.Author.Id === global_State.user?.Id
  );

  $effect(() => {
    loadData(); // Reactive data loading on route change
  });

  async function loadData() {
    if (!storyId) {
      // Creating new story
      postNewStory(newStorySubmitState);
      return;
    }

    storyLoadState.setLoading();
    try {
      story = await getStory(+storyId, storyLoadState, signal);
    } catch (err) {
      storyLoadState.setError(err.message, "StoryDetail");
    }
  }

  async function handleSave(formData: FormData) {
    newStorySubmitState.setInprogress();
    try {
      await postNewStory(newStorySubmitState, formData);
      newStorySubmitState.setSuccess();
      // Navigate back after success
      navigate("/stories", { replace: true });
    } catch (err) {
      newStorySubmitState.setError(err.message, "StorySubmit");
    }
  }
</script>

<!-- Breadcrumb -->
<Breadcrumb.Root>
  <Breadcrumb.Item>
    <Breadcrumb.Link href={p("/stories")}>Stories</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Page>{story?.Title}</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb.Root>

<!-- Loading States -->
{#if storyLoadState.loading}
  <Loading />
{:else if storyLoadState.error}
  <ErrorMessage message={storyLoadState.error} />
{:else if storyLoadState.ready}
  {#if userCanEdit}
    <form on:submit={handleSave}>
      <input name="title" bind:value={story.Title} />
      <RichTextEditor bind:content={story.Content} />
      <StoryFileGallery {storyFiles} />
      <button disabled={newStorySubmitState.inProgress}>
        {newStorySubmitState.inProgress ? "Saving..." : "Save"}
      </button>
      {#if newStorySubmitState.error}
        <ErrorMessage message={newStorySubmitState.error} />
      {/if}
    </form>
  {:else}
    <StoryDisplay {story} />
  {/if}
{/if}
```

### What to Learn

- AsyncSubmitState for form handling
- Rich text editor integration
- Role-based conditional rendering
- Route parameter extraction with derived
- Effect cleanup and abort signals
- Breadcrumb navigation pattern
- File gallery management

---

## Admin Dashboard

**Route:** `/admin`  
**File:** `src/routes/admin/index.svelte` & `layout.svelte`

### Features Demonstrated

- **Charts & Data Visualization** - LayerChart components (Area, Bar, Line, Donut)
- **Sidebar Navigation** - Collapsible sidebar with category navigation
- **Breadcrumb Context** - Navigation breadcrumbs for admin sections
- **Error Boundaries** - Wrapping complex dashboards
- **Analytics** - Tracking admin page visits
- **Layout System** - Multi-level routing with layouts

### Key Code Patterns

```svelte
<!-- layout.svelte -->
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar";
  import AppSidebar from "./_components/AppSidebar.svelte";
  import { navigating } from "$lib/common-library/integrations/router/router-helpers.svelte";

  let { children } = $props();
</script>

{#if navigating.afterload}
  <Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
      <header>
        <Sidebar.Trigger class="-ms-1" />
        <h1>Admin Dashboard</h1>
      </header>
      {@render children()}
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}

<!-- index.svelte -->
<script lang="ts">
  import AreaChart from "./_components/_charts/AreaChart.svelte";
  import BarChart from "./_components/_charts/BarChart.svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";

  trackAnalytics(); // Track page visit
</script>

<svelte:boundary>
  {#snippet failed(error, reset)}
    <ErrorBoundaryMessage {error} {reset} />
  {/snippet}

  <div class="grid grid-cols-3 gap-4 md:grid-cols-3">
    <AreaChart />
    <BarChart />
    <LineChart />
  </div>
  <div class="min-h-screen">
    <AreaChart />
  </div>
</svelte:boundary>
```

### What to Learn

- Sidebar component with nested routes
- Chart component integration
- Admin layout patterns
- Navigation state tracking
- Error boundary for complex pages

---

## Markdown Examples

**Route:** `/markdown`  
**File:** `src/routes/markdown/index.svelte`

### Features Demonstrated

- **Compile-time Markdown** - Import .md files as Svelte components
- **Interactive Components in Markdown** - Embed Svelte components
- **Code Blocks** - Syntax highlighting
- **Prose Styling** - Tailwind typography classes

### Key Code Patterns

```svelte
<script lang="ts">
  import SimpleMarkdown from "./_simple-markdown.md";
  import ComponentsInMarkdown from "./_components-in-markdown.md";
</script>

<div class="prose-sm sm:prose mx-auto dark:prose-invert">
  <svelte:boundary>
    {#snippet failed(error, reset)}
      <ErrorBoundaryMessage {error} {reset} />
    {/snippet}

    <h1>Markdown Examples</h1>
    <SimpleMarkdown />
    <h1>Interactive Components</h1>
    <ComponentsInMarkdown />
  </svelte:boundary>
</div>
```

### What to Learn

- mdsvex integration
- Importing markdown as components
- Embedding interactive demos
- Prose styling

---

## Quick Reference

| Feature            | Location                                | Route           |
| ------------------ | --------------------------------------- | --------------- |
| Carousel           | `/src/routes/index.svelte`              | `/`             |
| Polling            | `/src/routes/stories/index.svelte`      | `/stories`      |
| Rich Text Editor   | `/src/routes/stories/[id]/index.svelte` | `/stories/new`  |
| Forms & Validation | `/src/routes/stories/[id]/index.svelte` | `/stories/[id]` |
| Charts             | `/src/routes/admin/index.svelte`        | `/admin`        |
| Sidebar Navigation | `/src/routes/admin/layout.svelte`       | `/admin/*`      |
| Markdown           | `/src/routes/markdown/index.svelte`     | `/markdown`     |

---

## Next Steps

1. Open each route and examine the code
2. Check the `get.svelte.ts` files to see data loading patterns
3. Look at `_components/` folders for component composition
4. Study error handling and state management patterns
5. Use these as templates for new features

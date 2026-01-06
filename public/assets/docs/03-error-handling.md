---
id: errors
label: Error Handling
description: Boundaries, error tracking, recovery patterns
keywords:
  - error
  - boundary
  - catch
  - recover
  - report
  - fail
  - reliability
---

# Error Handling & Reliability

Multi-layered error handling to ensure reliability and good user experience.

**See also:** [State Management](/docs/state) (AsyncLoadState & AsyncSubmitState) | [API Integration](/docs/api) (request cancellation)

---

## Error Boundaries

Catch component render errors and prevent app crashes.

```svelte
<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage
      customError="Error rendering stories"
      {error}
      {reset}
    />
  {/snippet}

  <StoriesList />
</svelte:boundary>
```

**How it works:**

1. Wraps component in error boundary
2. If component throws, boundary catches it
3. Displays user-friendly error message
4. Automatically reports to SharePoint
5. User can retry with reset button

**Best practice:** Use on every page and major component

---

## Async State Error Tracking

Errors in `AsyncLoadState` and `AsyncSubmitState` are automatically reported to SharePoint. See [State Management](/docs/state) for detailed patterns.

**Data Loading:**

```ts
const loadState = new AsyncLoadState();

try {
  const data = await getListItems({...});
  loadState.setReady();
} catch (err) {
  // Automatically calls reportError() and sets loadState.error
  loadState.setError(err.message, "StoryLoad");
}

{#if loadState.error}
  <p class="text-red-500">{loadState.error}</p>
{/if}
```

**Form Submission:**

```ts
const submitState = new AsyncSubmitState();

try {
  submitState.setInprogress();
  await postNewStory(submitState, formData);
  submitState.setSuccess();
} catch (err) {
  // Automatically reports, sets submitState.error
  submitState.setError(err.message, "FormSubmit");
}

{#if submitState.error}
  <ErrorMessage message={submitState.error} />
{/if}
```

---

## Centralized Error Reporting

All errors automatically logged to SharePoint for monitoring and debugging.

**Logged data:**

- Context: Where error occurred (e.g., "StoryLoad")
- ErrorType: Type of error (network, auth, validation, render, other)
- TechnicalMessage: Full error details
- UserMessage: User-friendly message
- RouteUrl: Current page URL
- BrowserUserAgent: User's browser info
- Author: SharePoint user (auto-captured)
- Timestamp: When error occurred

**Manual reporting:**

```ts
import { reportError } from "$lib/common-library/integrations/error-handling/report-error";

try {
  await riskyOperation();
} catch (err) {
  reportError({
    context: "stories/upload",
    errorType: "network",
    technicalMessage: err.message,
    userMessage: "Failed to upload file. Please try again.",
  });
}
```

---

## Request Cancellation (Prevents Errors)

Automatically cancel in-flight requests on unmount with `useAbortController`.

```ts
import { useAbortController } from "$lib/hooks/useAbortController.svelte";

const { signal } = useAbortController();

async function loadData() {
  const result = await getListItems({
    listName: "Stories",
    dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
    signal, // Pass signal to all API calls
  });
}

// When component unmounts, all requests with signal are automatically canceled
```

**Why this matters:**

- Prevents "Cannot set property of unmounted component" errors
- Saves bandwidth (cancelled requests don't complete)
- Keeps request queue clean
- Essential for cleanup

---

## Pattern: Robust Data Loading

Combines all error handling techniques:

```ts
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { useAbortController } from "$lib/hooks/useAbortController.svelte";

const { signal } = useAbortController();
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
      signal, // Auto-cancel on unmount
    });
    stories = response.value;
    loadState.setReady();
  } catch (err) {
    loadState.setError(err.message, "StoryList"); // Auto-reports
  }
}
```

**Wrapping:**

```svelte
<svelte:boundary>
  {#snippet failed(error, reset)}
    <ErrorBoundaryMessage {error} {reset} />  <!-- Catches render errors -->
  {/snippet}

  {#if loadState.loading}
    <Loading />
  {:else if loadState.error}
    <ErrorMessage message={loadState.error} />  <!-- Shows tracked errors -->
  {:else if loadState.ready}
    <StoriesList {stories} />
  {/if}
</svelte:boundary>
```

---

## Error Handling Checklist

✅ **DO:**

- Wrap pages and major components in error boundaries
- Use AsyncLoadState for data loading
- Use AsyncSubmitState for form submissions
- Always pass signal to API calls
- Handle loading/error/ready states in templates

❌ **DON'T:**

- Ignore errors (they won't be reported)
- Forget error boundaries (crashes aren't user-friendly)
- Leave requests hanging (always pass signal)
- Show technical errors to users (use userMessage)
- Mix error handling with business logic

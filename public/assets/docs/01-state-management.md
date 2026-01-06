---
id: state
label: State Management
description: Reactive state, async loading, form submission
keywords:
  - state
  - reactive
  - runes
  - loading
  - form
  - submit
  - async
---

# State Management

Manage application state with Svelte 5 runes and async operations.

**See also:** [Error Handling](/docs/errors) (automatic error reporting) | [API Integration](/docs/api) (data fetching patterns)

---

## Async State for Data Loading

Track data loading with `AsyncLoadState`.

```ts
AsyncLoadState;

const loadState = new AsyncLoadState();

$effect(() => {
  loadStories();
});

async function loadStories() {
  loadState.setLoading();
  try {
    const provider = getDataProvider();
    const data = await provider.getListItems({
      listName: "Stories",
      signal,
    });
    stories = data.value;
    loadState.setReady();
  } catch (err) {
    loadState.setError(err.message, "StoryLoad");
  }
}
```

**Methods:**

- `setLoading()` - Start loading
- `setReady()` - Mark as ready
- `setError(message, context?)` - Record error, auto-reports to SharePoint (see [Error Handling](/docs/errors))
- `resetForm()` - Reset to initial state

**Usage in templates:**

```svelte
{#if loadState.loading}
  <LoadingSpinner />
{:else if loadState.error}
  <ErrorMessage message={loadState.error} />
{:else if loadState.ready}
  <StoriesList {stories} />
{/if}
```

---

## Async State for Form Submissions

Track form submission lifecycle with `AsyncSubmitState`.

```ts
AsyncSubmitState;

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

**States:** initial → attempted → inProgress → success/error

**Methods:**

- `setInprogress()` - Start submission
- `setSuccess()` - Mark as successful
- `setError(message, context?)` - Record error, auto-reports
- `setAttempted()` - Mark form as touched
- `setMessage(msg)` - Set custom message
- `resetForm()` - Reset state

**Usage in templates:**

```svelte
<form on:submit={handleSubmit}>
  <input disabled={submitState.inProgress} />
  <button disabled={submitState.inProgress}>
    {submitState.inProgress ? "Saving..." : "Save"}
  </button>
  {#if submitState.error}
    <p class="text-red-500">{submitState.error}</p>
  {/if}
</form>
```

---

## Global State Management

Centralized application state with Svelte 5 runes. Protected with setter functions.

**Location:** `src/lib/data/global-state.svelte.ts`

```ts
// Define state
export const global_State = $state({
  user: undefined,
  userProperties: undefined,
  AccessRole: null,
});

// Setter functions (with validation)
export function setCurrentUser(user: Sharepoint_User | undefined) {
  if (user && (!user.Id || !user.LoginName)) {
    console.warn("Invalid user data");
    return;
  }
  global_State.user = user;
}

export function setAccessRole(role: AccessRole) {
  if (!role || (role !== "Admin" && role !== "Viewer" && role !== "Editor")) {
    console.warn("Invalid role");
    return;
  }
  global_State.AccessRole = role;
}

export function setUserProperties(properties: Sharepoint_User_Properties | undefined) {
  if (properties && !properties.AccountName) {
    console.warn("Invalid properties");
    return;
  }
  global_State.userProperties = properties;
}

export function resetGlobalState() {
  global_State.user = undefined;
  global_State.AccessRole = null;
  global_State.userProperties = undefined;
}
```

**Usage in components:**

```svelte
<script>
  import { global_State, setCurrentUser } from "$lib/data/global-state.svelte";
  import { getCurrentUser } from "$lib/common-library/integrations/sharepoint-rest-api/get/getCurrentUser";

  const loadState = new AsyncLoadState();

  $effect.pre(() => {
    initializeUser();
  });

  async function initializeUser() {
    try {
      const provider = getDataProvider();
      const user = await provider.getCurrentUser({
        signal,
      });
      setCurrentUser(user);
      loadState.setReady();
    } catch (err) {
      loadState.setError(err.message);
    }
  }
</script>

{#if global_State.user}
  <p>Welcome, {global_State.user.Title}!</p>
{/if}
```

**Role-based Rendering:**

```svelte
{#if global_State.AccessRole === "Admin"}
  <AdminPanel />
{:else if global_State.AccessRole === "Editor"}
  <EditorPanel />
{:else}
  <ViewerPanel />
{/if}
```

**Why Setters?**

- Validate before setting
- Prevent invalid states
- Single point of mutation
- Easier debugging and testing

---

## Best Practices

✅ **DO:**

- Use AsyncLoadState for data loading
- Use AsyncSubmitState for form submissions
- Call setError() to auto-report to SharePoint
- Use setter functions for global state
- Wrap async operations in error boundaries

❌ **DON'T:**

- Mutate global_State directly (always use setters)
- Forget to pass signal to API calls
- Mix loading states with component logic
- Use global state for temporary UI state

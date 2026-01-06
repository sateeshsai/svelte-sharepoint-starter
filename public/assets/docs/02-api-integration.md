---
id: api
label: API Integration
description: SharePoint REST API, request dedup, cancellation, offline
keywords:
  - api
  - sharepoint
  - request
  - cancel
  - dedup
  - offline
  - rest
  - data
---

# API Integration & Data Fetching

SharePoint REST API, request deduplication, cancellation, and offline development through the **DataProvider pattern**.

**See also:** [State Management](/docs/state) (AsyncLoadState patterns) | [Error Handling](/docs/errors) (error recovery) | [Architecture & Layers](/docs/architecture) (layer details) | [Config Validation](/docs/config) (configuration validation)

---

## Initialization

The DataProvider is initialized automatically at app startup in `src/main.ts`:

```ts
import { initializeDataProviders } from "./lib/data/provider-factory";

// Call before mounting the app
// Note: Config is validated automatically during initialization
initializeDataProviders();
```

This function:

1. **Validates the SharePoint configuration** using Zod schema - catches typos and missing fields
2. **Registers both MockDataProvider** (for LOCAL_MODE) and **SharePointDataProvider** (for production) into the common-library registry
3. **Injects config into providers** via constructor (no global imports)

After initialization, `getDataProvider()` is safe to call from anywhere in the app.

**Config Validation:** If your `src/lib/env/sharepoint-config.ts` has invalid fields, an error boundary will display a helpful message with debugging steps.

---

## DataProvider Pattern

Instead of calling REST functions directly, the app uses a **DataProvider** abstraction that automatically switches between real SharePoint API and mock data based on environment.

**Benefits:**

- Single API surface for all data operations
- Automatic LOCAL_MODE/production switching
- No conditional logic scattered in UI code
- Easy to test with mock implementations
- Config validated at startup (fails fast with clear errors)

---

## Fetching Data from SharePoint

**Location:** `src/lib/data/provider-factory.ts`

```ts
import { getDataProvider } from "$lib/data/provider-factory";

// Get the provider (automatically selects SharePoint or Mock based on LOCAL_MODE)
const provider = getDataProvider();

// Fetch stories
const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title"],
    ["filter", "Active eq true"],
  ],
  signal: abortController.signal,
});

const stories = response.value;
```

**Operations (OData):**

```ts
// Select specific fields
["select", "Id,Title,Author/Id,Author/Title"][
  // Expand related items
  ("expand", "Author")
][
  // Filter with conditions
  ("filter", "Active eq true")
][
  // Order results
  ("orderby", "Created desc")
][
  // Limit results
  ("top", "10")
];
```

**Complete Example:**

```ts
const provider = getDataProvider();

const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title,Content,Author/Id,Author/Title"],
    ["expand", "Author"],
    ["filter", "Active eq true"],
    ["orderby", "Modified desc"],
    ["top", "50"],
  ],
  signal: abortController.signal,
});

const stories = response.value;
```

---

## Current User Information

Fetch current user data and properties.

```ts
const provider = getDataProvider();

// Get current user
const user = await provider.getCurrentUser({
  signal,
});

// Get detailed user properties
const userProps = await provider.getCurrentUserProperties({
  signal,
});

// Extract first and last names
const { first, last } = getUserFirstLastNames(userProps.value);

// Get profile picture URL
const picUrl = getPictureUrl(userProps.value);
```

---

## Request Deduplication

Automatic caching of simultaneous identical requests. Same request within cache TTL returns cached promise.

**How it works:**

```
Request 1: getListItems({...}) → Hits API, caches promise
Request 2: getListItems({...}) → Same params, returns cached promise
Request 3: getListItems({...}) → Within TTL, returns cache
Request 4: getListItems({...}) → After TTL, hits API again
```

**Default TTLs:**

- getListItems - 30 seconds
- getCurrentUser - 60 seconds
- getCurrentUserProperties - 60 seconds
- getFormDigestValue - 30 seconds

**Cache Key:** Full request URL including all query parameters

**Benefits:**

- Reduces SharePoint API load
- Prevents race conditions
- Improves perceived performance
- Transparent to calling code (no changes needed)

**In Practice:**

```ts
// Home page
const stories = await getListItems({ listName: "Stories", ... });

// Meanwhile, Stories page calls
const stories = await getListItems({ listName: "Stories", ... });
// Same request within 30s → returns cached promise!
```

---

## Request Cancellation

Automatically cancel in-flight requests when components unmount or users navigate. This prevents common errors when components unmount before async operations complete (see [Error Handling](/docs/errors)).

**Hook:** `useAbortController`

```ts
import { useAbortController } from "$lib/hooks/useAbortController.svelte";
import { getDataProvider } from "$lib/data/provider-factory";

const { signal } = useAbortController();

$effect(() => {
  loadData(signal); // Auto-canceled on unmount
});

async function loadData(signal: AbortSignal) {
  const provider = getDataProvider();
  const result = await provider.getListItems({
    listName: "Stories",
    signal, // Pass signal to API calls
  });
}
```

**How it works:**

1. useAbortController creates AbortController
2. Returns signal for API calls
3. Automatically aborts on component unmount
4. Prevents "Cannot set property of unmounted component" errors

**Real-world scenario:**

```ts
const { signal } = useAbortController();
let storyLoadState = new AsyncLoadState();

$effect(() => {
  loadStory();
});

async function loadStory() {
  storyLoadState.setLoading();
  try {
    // If user navigates away before this completes:
    const story = await getStory(storyId, storyLoadState, signal);
    // signal.abort() is called automatically
    // request is canceled, setReady() never called
  } catch (err) {
    storyLoadState.setError(err.message);
  }
}
```

---

## Local Development Mode (LOCAL_MODE)

Offline-first development with automatic provider switching. When on localhost, the **DataProvider automatically returns mock data** without any code changes.

**Auto-Detection:**

```ts
// src/lib/common-library/utils/local-dev/modes.ts
export const LOCAL_MODE =
  hostname === "localhost" ||
  hostname.startsWith("127.") || // 127.0.0.1, 127.0.0.2
  hostname === "::1" || // IPv6 localhost
  hostname === "[::1]"; // IPv6 with brackets

// Automatically detects:
// localhost:5173 ✅ → MockDataProvider
// 127.0.0.1:5173 ✅ → MockDataProvider
// [::1]:5173 ✅ → MockDataProvider
// production URL ❌ → SharePointDataProvider
```

**How It Works:**

```ts
import { getDataProvider } from "$lib/data/provider-factory";

const provider = getDataProvider();
// If LOCAL_MODE: returns MockDataProvider instance
// If production: returns SharePointDataProvider instance

// Same call works in both environments!
const response = await provider.getListItems({
  listName: "Stories",
  operations: [["select", "Id,Title"]],
  signal,
});

// localhost: returns mock data instantly
// production: hits SharePoint API
```

**DataProvider Implementations:**

1. **MockDataProvider** (`$lib/data/mock-data-provider.ts`)

   - Uses LOCAL_STORY_ITEMS, LOCAL_USERS, etc. from `$lib/data/local-data.ts`
   - Simulates network delays (300-500ms)
   - For polling, simulates creating new items (30% chance per poll)

2. **SharePointDataProvider** (`$lib/common-library/integrations/sharepoint-rest-api/providers/sharepoint-data-provider.ts`)
   - Real implementation wrapping existing REST functions
   - Makes actual HTTP requests to SharePoint

**Fake Data Available:**

```ts
import { LOCAL_STORY_ITEMS, LOCAL_ENGAGEMENTS, LOCAL_FILES, LOCAL_USERS } from "$lib/data/local-data";
import { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "$lib/common-library/integrations/sharepoint-rest-api/data/local-data";
```

**Benefits:**

- Develop without SharePoint connectivity
- Instant responses (no network latency)
- Consistent test data
- No code changes between local/production
- Automatic switching via LOCAL_MODE detection
- Perfect for demos and CI/CD
- No `dataToReturnInLocalMode` parameters needed

---

## Pattern: Load Data with Error Handling

```ts
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { useAbortController } from "$lib/hooks/useAbortController.svelte";
import { getDataProvider } from "$lib/data/provider-factory";
import type { Story_ListItem } from "$lib/data/types";

const { signal } = useAbortController();
let items: Story_ListItem[] | undefined = $state();
const loadState = new AsyncLoadState();

$effect(() => {
  loadItems();
});

async function loadItems() {
  loadState.setLoading();
  try {
    const provider = getDataProvider();

    const response = await provider.getListItems({
      listName: "Stories",
      operations: [
        ["select", "Id,Title,Author/Id,Author/Title"],
        ["expand", "Author"],
        ["filter", "Active eq true"],
      ],
      signal,
    });
    items = response.value;
    loadState.setReady();
  } catch (err) {
    loadState.setError(err.message, "ItemLoad");
  }
}
```

---

## Best Practices

✅ **DO:**

- Use `getDataProvider()` to get the provider instance
- Always pass signal to API calls
- Use AsyncLoadState to track loading/ready/error
- Let deduplication work (same request = cached result)
- Wrap in error boundaries
- Rely on automatic LOCAL_MODE/production switching

❌ **DON'T:**

- Import REST functions directly (use provider instead)
- Forget signal (requests won't cancel on unmount)
- Make duplicate API calls in same effect
- Hardcode data (use provider, it handles LOCAL_MODE)
- Ignore error states
- Mix API logic with component rendering
- Use `dataToReturnInLocalMode` (not supported anymore)

---

## Architecture

**DataProvider Pattern Details:** See [Architecture & Layers](/docs/architecture)

**Locations:**

- **Interface:** `src/lib/common-library/integrations/sharepoint-rest-api/providers/data-provider.ts`
- **Real API:** `src/lib/common-library/integrations/sharepoint-rest-api/providers/sharepoint-data-provider.ts`
- **Mock Base:** `src/lib/common-library/integrations/sharepoint-rest-api/providers/base-mock-data-provider.ts`
- **App Mock:** `src/lib/data/mock-data-provider.ts` (extends base, provides project data)
- **Factory (Registry):** `src/lib/common-library/integrations/sharepoint-rest-api/providers/provider-registry.ts`
- **Factory (Wrapper):** `src/lib/data/provider-factory.ts` (app orchestration & initialization)

**Key Principle:** Common-library provides reusable interfaces, base classes, and provider registry. App layer provides concrete implementations (MockDataProvider) and orchestration (initialization, config). This enables true portability: copy `common-library/` to another project with minimal changes.

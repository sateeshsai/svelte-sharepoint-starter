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

SharePoint REST API, request deduplication, cancellation, and offline development.

**See also:** [State Management](/docs/state) (AsyncLoadState patterns) | [Error Handling](/docs/errors) (error recovery)

---

## Fetching Data from SharePoint

**Location:** `src/lib/common-library/integrations/sharepoint-rest-api/get/getListItems.ts`

```ts
// Basic fetch
const response = await getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title"],
    ["filter", "Active eq true"],
  ],
  dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
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
const response = await getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title,Content,Author/Id,Author/Title"],
    ["expand", "Author"],
    ["filter", "Active eq true"],
    ["orderby", "Modified desc"],
    ["top", "50"],
  ],
  dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
  signal: abortController.signal,
});

const stories = response.value;
```

---

## Current User Information

Fetch current user data and properties.

```ts
// Get current user
const user = await getCurrentUser({
  dataToReturnInLocalMode: { value: LOCAL_SHAREPOINT_USERS[0] },
  signal,
});

// Get detailed user properties
const userProps = await getCurrentUserProperties({
  dataToReturnInLocalMode: { value: LOCAL_SHAREPOINT_USERS_PROPERTIES[0] },
  signal,
});

// Extract first and last names
const { first, last } = getUserFirstLastNames(userProps);

// Get profile picture URL
const picUrl = getPictureUrl(userProps);
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

const { signal } = useAbortController();

$effect(() => {
  loadData(signal); // Auto-canceled on unmount
});

async function loadData(signal: AbortSignal) {
  const result = await getListItems({
    listName: "Stories",
    dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
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

Offline-first development. When on localhost, all API calls return fake data instantly.

**Auto-Detection:**

```ts
// src/lib/env/env.ts
export const LOCAL_MODE =
  hostname === "localhost" ||
  hostname.startsWith("127.") || // 127.0.0.1, 127.0.0.2
  hostname === "::1" || // IPv6 localhost
  hostname === "[::1]"; // IPv6 with brackets

// Automatically detects:
// localhost:5173 ✅
// 127.0.0.1:5173 ✅
// [::1]:5173 ✅
// production URL ❌
```

**Usage:**

```ts
import { LOCAL_STORY_ITEMS } from "$lib/data/local-data";

const response = await getListItems({
  listName: "Stories",
  operations: [["select", "Id,Title"]],
  dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
  signal,
});

// On localhost: returns LOCAL_STORY_ITEMS immediately (no delay)
// On production: hits SharePoint API
```

**Fake Data Available:**

```ts
import { LOCAL_STORY_ITEMS, LOCAL_USERS, LOCAL_FILES, LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "$lib/data/local-data";
```

**Benefits:**

- Develop without SharePoint connectivity
- Instant responses (no network latency)
- Consistent test data
- No code changes between local/production
- Perfect for demos and CI/CD

---

## Pattern: Load Data with Error Handling

```ts
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { useAbortController } from "$lib/hooks/useAbortController.svelte";
import { getListItems } from "$lib/common-library/integrations/sharepoint-rest-api/get/getListItems";

const { signal } = useAbortController();
let items: Story_ListItem[] | undefined = $state();
const loadState = new AsyncLoadState();

$effect(() => {
  loadItems();
});

async function loadItems() {
  loadState.setLoading();
  try {
    const response = await getListItems({
      listName: "Stories",
      operations: [
        ["select", "Id,Title,Author/Id,Author/Title"],
        ["expand", "Author"],
        ["filter", "Active eq true"],
      ],
      dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS },
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

- Always pass signal to API calls
- Provide dataToReturnInLocalMode for offline development
- Use AsyncLoadState to track loading/ready/error
- Let deduplication work (same request = cached result)
- Wrap in error boundaries

❌ **DON'T:**

- Forget signal (requests won't cancel on unmount)
- Make duplicate API calls in same effect
- Hardcode data (use LOCAL_MODE)
- Ignore error states
- Mix API logic with component rendering

---
id: analytics
label: Analytics
description: Tracking, sessions, user metrics, monitoring
keywords:
  - analytics
  - tracking
  - session
  - metric
  - monitor
  - event
---

# Analytics Tracking

## Overview

Track user journeys and page visits with automatic analytics collection. Each page visit creates a SharePoint list entry with route, session, and optional custom data.

**See also:** [State Management](/docs/state) (global state for user tracking) | [Examples](/docs/examples) (implementation in real pages)

---

## How It Works

**Location:** `src/lib/common-library/integrations/analytics/analytics.ts`

**Session Flow:**

```
User visits page
├─ trackAnalytics() called (per-component closure state)
├─ Entry created in Analytics list
├─ Stores: Route, Session ID, Version, Custom Data
│
User stays on page for X seconds
│
User navigates away
├─ Component unmounts, cleanup runs
├─ Entry updated (Modified timestamp = leave time)
└─ Created - Modified = time spent on page
```

**Note:** Each component that calls `trackAnalytics()` gets its own tracking state - multiple pages can track independently without interference.

---

## Session Management

Each browser session gets unique ID (shared across all page visits):

```ts
let sessionId = randomIdString(); // e.g., "a7f3k8m2"

// All page visits in same session share ID
// Allows tracking user journey: Home → Stories → Detail
```

---

## Basic Usage

Call at top level of page component to track that specific route:

```svelte
<!-- src/routes/stories/index.svelte -->
<script>
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";

  trackAnalytics();  // Track this specific page
</script>

<main>
  <!-- Page content -->
</main>
```

**Per-Component Tracking:** Each component gets independent tracking - if you navigate from Stories to Admin, both create separate entries without conflicts.

---

## What Gets Logged

**Automatically:**

- `Route`: Current page URL (e.g., `#/stories`)
- `SessionId`: Unique session identifier
- `Title`: App version
- `Created`: When user arrived at page
- `Modified`: When user left page
- `Author`: SharePoint user (auto-captured)

**Optionally:**

- Custom data: Pass as object

---

## Custom Data

Pass arbitrary data to track specific user actions:

```ts
trackAnalytics({
  action: "view",
  category: "stories",
  itemId: 42,
  timestamp: new Date().toISOString(),
});
```

**Data stored as:** Stringified JSON in `Data` field

**Retrieve later:**

```ts
import { parseStringifiedKV } from "$lib/common-library/integrations/analytics/analytics";

const customData = parseStringifiedKV(analyticsEntry.Data);
console.log(customData.action); // "view"
```

---

## Calculate Time on Page

```ts
// In SharePoint
timeSpentSeconds = (Modified - Created) / 1000

// Example
Created:  2025-01-06 14:00:00
Modified: 2025-01-06 14:02:45
Time on page: 165 seconds (2.75 minutes)
```

---

## View Analytics Data

All entries stored in **AnalyticsList**:

```ts
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";

// List name
SHAREPOINT_CONFIG.lists.Analytics.name; // "AnalyticsList"

// Fields: Route, SessionId, Title, Data, Author, Created, Modified
```

---

## Rules for Calling trackAnalytics()

✅ **DO:** Call once per page at top level

```svelte
<!-- src/routes/stories/index.svelte -->
<script>
  trackAnalytics();  // ✅ Called once at script level
</script>
```

❌ **DON'T:** Call in child components

```svelte
<!-- src/routes/stories/_components/Stories.svelte -->
<script>
  trackAnalytics();  // ❌ Creates duplicate entries
</script>
```

❌ **DON'T:** Call in loops or effects

```svelte
<script>
  onMount(() => {
    trackAnalytics();  // ❌ Called on every mount
  });
</script>
```

---

## Real-World Example

Track user journey through app:

```ts
// src/routes/index.svelte
trackAnalytics(); // User visits home

// src/routes/stories/index.svelte
trackAnalytics(); // User navigates to stories list

// src/routes/stories/[id]/index.svelte
trackAnalytics({
  storyId: params.id,
  storyTitle: story.Title,
}); // User views specific story
```

**Result:** Session shows:

```
SessionId: abc123
Entry 1: Route=#/,          Time=0-10s
Entry 2: Route=#/stories,   Time=10-45s
Entry 3: Route=#/stories/5, Time=45-120s (custom data included)
```

---

## Analytics Reports

**Example Queries in SharePoint:**

**Most visited pages:**

```
Group by Route
Count entries
Order by count DESC
```

**Time spent per page:**

```
Select Route, (Modified - Created) as TimeSpent
Average TimeSpent by Route
```

**User journeys by session:**

```
Filter by SessionId = 'abc123'
Order by Created ASC
Shows user's complete journey
```

**Peak traffic times:**

```
Group by HOUR(Created)
Count entries
Shows when users are most active
```

---

## Best Practices

✅ **DO:** Track important pages

- Home page
- Main features (Stories, Admin)
- Key workflows

✅ **DO:** Pass meaningful custom data

```ts
trackAnalytics({
  action: "search",
  query: "svelte",
  resultsCount: 12,
});
```

✅ **DO:** Clean up old entries

```
SharePoint list will grow large over time
Periodically delete entries older than X months
```

❌ **DON'T:** Track utility/layout pages

- `/docs` (help pages)
- `/admin` (internal only)

❌ **DON'T:** Track sensitive data

```ts
// DON'T include passwords, tokens, SSNs
trackAnalytics({
  userId: currentUser.Id, // OK
  userId: currentUser.email, // OK
  apiKey: "secret", // DON'T
});
```

---

## Data Privacy

**Stored data:**

- Route (public page URL)
- Session ID (anonymous)
- Author (SharePoint user - public)
- Custom data (whatever you pass)

**No:** Personal identifiable info automatically captured
**Recommendation:** Exclude sensitive data from custom data object

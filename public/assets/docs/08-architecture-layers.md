---
id: architecture
label: Architecture & Layers
description: Code organization, library separation, DataProvider pattern, config validation, and layer boundaries
keywords:
  - architecture
  - common-library
  - app-layer
  - separation
  - dataprovider
  - reusability
  - config
  - validation
---

# Architecture & Code Organization

## Layer Separation

This starter maintains a strict separation between **common-library** (reusable) and **app layer** (project-specific) to enable code reuse across team projects.

```
src/lib/
├── common-library/              ← Reusable across projects
│   └── integrations/
│       ├── sharepoint-rest-api/
│       │   ├── providers/
│       │   │   ├── data-provider.ts              (interface)
│       │   │   ├── base-mock-data-provider.ts    (abstract, reusable)
│       │   │   ├── sharepoint-data-provider.ts   (real API implementation)
│       │   │   ├── provider-registry.ts          (DI registry)
│       │   │   └── index.ts                      (barrel export)
│       │   ├── rest-functions/
│       │   │   ├── get/                          (GET operations)
│       │   │   ├── post/                         (POST operations)
│       │   │   ├── update/                       (UPDATE operations)
│       │   │   ├── delete/                       (DELETE operations)
│       │   │   ├── helpers/                      (dedup, polling)
│       │   │   └── index.ts                      (barrel export)
│       │   ├── config/
│       │   │   ├── config.ts                     (Zod validation schema)
│       │   │   └── index.ts                      (barrel export)
│       │   ├── data/
│       │   │   ├── types.ts                      (SharePoint type definitions)
│       │   │   ├── schemas.ts                    (Zod schemas for types)
│       │   │   ├── local-data.ts                 (mock data)
│       │   │   └── index.ts                      (barrel export)
│       │   ├── constants/
│       │   │   ├── const.ts                      (ACCESS_ROLES, error actions)
│       │   │   ├── errors.ts                     (error codes)
│       │   │   └── index.ts                      (barrel export)
│       │   ├── utilities/
│       │   │   ├── helpers.ts                    (utility functions)
│       │   │   └── index.ts                      (barrel export)
│       │   └── index.ts                          (root barrel export)
│       ├── analytics/, error-handling/, router/, pwa/
│       └── utils/
├── data/                        ← App layer (project-specific)
│   ├── mock-data-provider.ts    (extends BaseMockDataProvider)
│   ├── provider-factory.ts      (orchestration + config validation)
│   ├── global-state.svelte.ts   (app state)
│   └── schemas.ts               (app-specific Zod schemas)
├── env/                         ← App-specific config
│   ├── sharepoint-config.ts     (list names, URLs - validated at startup)
│   └── sharepoint-paths.ts
└── routes/, hooks/, etc.
```

---

## DataProvider Pattern (Issues #1-3)

### Overview

The **DataProvider** pattern abstracts all data operations, enabling automatic switching between real SharePoint API (production) and mock data (development).

**Benefits:**

- ✅ No conditional `if (LOCAL_MODE)` logic in UI code
- ✅ Single entry point for all data operations
- ✅ Easy to test with mock implementations
- ✅ Reusable across projects
- ✅ Config validated at startup with clear error messages

---

### Architecture

#### 1. DataProvider Interface (common-library)

**Location:** `src/lib/common-library/integrations/sharepoint-rest-api/providers/data-provider.ts`

```typescript
export interface DataProvider {
  getListItems<T>(...): Promise<T | Sharepoint_Error_Formatted>;
  getCurrentUser<T>(...): Promise<T | Sharepoint_Error_Formatted>;
  getCurrentUserProperties(...): Promise<...>;
  getFormDigestValue(...): Promise<...>;
  postListItem<T>(...): Promise<T | Sharepoint_Error_Formatted>;
  readAndUploadFile(...): Promise<...>;
  updateListItem(...): Promise<...>;
  deleteListItem(...): Promise<...>;
}
```

**Key point:** Interface lives in common-library because it's the contract that common-library exports.

---

#### 2. BaseMockDataProvider (common-library, abstract)

**Location:** `src/lib/common-library/integrations/sharepoint-rest-api/base-mock-data-provider.ts`

Implements `DataProvider` with reusable logic:

- Delay simulation (network latency)
- OData filter parsing
- Generic SharePoint user mock data
- Abstract method: `getDataForList(listName)`

```typescript
export abstract class BaseMockDataProvider implements DataProvider {
  /**
   * Subclasses implement this to return project-specific mock data
   */
  protected abstract getDataForList(listName: string): any[];

  async getListItems<T>(...): Promise<T | ...> {
    let mockData = this.getDataForList(options.listName); // ← Calls abstract

    // Filtering, delay simulation logic (reusable)
    if (options.operations) { ... }

    return { value: mockData } as T;
  }

  // Other methods inherited by subclass
}
```

**Portability:** Any project can extend this class and provide their own mock data.

---

#### 3. MockDataProvider (app layer, concrete)

**Location:** `src/lib/data/mock-data-provider.ts`

Extends `BaseMockDataProvider` and provides project-specific data mapping:

```typescript
import { SHAREPOINT_CONFIG, type AppSharePointConfig } from "$lib/env/sharepoint-config";

/**
 * Type-safe mock data mapping
 * TypeScript enforces an entry for EVERY list defined in SHAREPOINT_CONFIG
 * Adding a new list to config without adding mock data here will cause a compile error
 */
type ListNames = AppSharePointConfig["lists"][keyof AppSharePointConfig["lists"]]["name"];
type MockDataMap = Record<ListNames, any[]>;

const MOCK_DATA_BY_LIST_NAME: MockDataMap = {
  [SHAREPOINT_CONFIG.lists.Story.name]: LOCAL_STORY_ITEMS,
  [SHAREPOINT_CONFIG.lists.Engagements.name]: LOCAL_ENGAGEMENTS,
  [SHAREPOINT_CONFIG.lists.StoryFiles.name]: LOCAL_FILES,
  // ... TypeScript enforces ALL lists have entries
};

export class MockDataProvider extends BaseMockDataProvider {
  protected getDataForList(listName: string): any[] {
    return MOCK_DATA_BY_LIST_NAME[listName] ?? [];
  }
}
```

---

### Provider Factory Pattern (Dependency Injection)

To keep common-library truly reusable, the provider factory uses **lazy registration** instead of importing app implementations directly.

#### 1. Common-Library Registry

**Location:** `src/lib/common-library/integrations/sharepoint-rest-api/provider-factory.ts`

```typescript
export function registerProviders(mock: DataProvider, real: DataProvider): void {
  // App layer calls this at startup with concrete implementations
}

export function getDataProvider(localMode: boolean): DataProvider {
  // Returns registered implementation
}
```

**Key point:** Common-library NEVER imports app layer. It just manages registered instances.

---

#### 2. App-Layer Wrapper

**Location:** `src/lib/data/provider-factory.ts`

```typescript
import { registerProviders as registerInRegistry } from "$lib/common-library/.../provider-factory";
import { MockDataProvider } from "./mock-data-provider";
import { SharePointDataProvider } from "$lib/common-library/.../sharepoint-data-provider";

export function initializeDataProviders(): void {
  registerInRegistry(new MockDataProvider(), new SharePointDataProvider());
}

export function getDataProvider(): DataProvider {
  return getProviderFromRegistry(LOCAL_MODE);
}
```

**Key point:** App layer owns initialization. Provides familiar `getDataProvider()` API to the rest of the app.

---

#### 3. Initialization at Startup

**Location:** `src/main.ts`

```typescript
import { initializeDataProviders } from "./lib/data/provider-factory";

// Initialize before mounting app
// Config validation happens automatically during initialization
initializeDataProviders();

// Now safe to use getDataProvider() anywhere
const app = mount(App, { target: document.getElementById("app")! });
```

**What happens during initialization:**

1. **Config Validation** - Zod schema validates your `sharepoint-config.ts`

   - Required fields: `paths.site_collection`, list names, folder names
   - Detects typos and missing fields with clear error messages
   - Shows error page if validation fails (prevents silent bugs)

2. **Provider Registration** - Both MockDataProvider and SharePointDataProvider are created and registered
3. **Ready to Use** - `getDataProvider()` can be safely called from anywhere

**If config is invalid:**

An error boundary (`src/_components/ConfigErrorBoundary.svelte`) catches the validation error and displays:

- Formatted error message showing which fields are invalid
- Debugging checklist (URLs must be valid, fields must not be empty, etc.)
- Link to browser console for full details

See [Config Validation](/docs/config) for more details.

---

**Benefits:**

- ✅ Explicit initialization (clear when providers are registered)
- ✅ Config validated at startup (fails fast with helpful errors)
- ✅ Easy to swap implementations in tests

---

### How It Works in Code

#### Getting the Provider

```typescript
import { getDataProvider } from "$lib/data/provider-factory";

const provider = getDataProvider();
// Returns:
// - MockDataProvider (instant mock data) on localhost
// - SharePointDataProvider (real API) in production
```

#### Using the Provider

```typescript
const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title"],
    ["filter", "Active eq true"],
  ],
  signal: abortController.signal,
});

const stories = response.value; // Same interface regardless of provider
```

#### Mock Response Escape Hatch

All CRUD methods support an optional `mockResponse` parameter for LOCAL_MODE testing. When provided, the mock provider returns this exact data instead of generating mock data:

```typescript
// Override mock data for specific test scenarios
const testStory = { Id: 999, Title: "Test Story", Created: new Date().toISOString() };

const response = await provider.postListItem({
  listName: "Stories",
  body: { Title: "Test Story" },
  mockResponse: testStory, // ← Mock provider returns this exactly
});

// In production, mockResponse is ignored - real SharePoint API is called
```

**Use cases:**

- Testing specific edge cases
- Simulating specific server responses
- Integration testing with known data

#### Response Format (odata=nometadata)

SharePoint with `odata=nometadata` header returns **flat data** (no `{ d: {...} }` wrapper):

```typescript
// ✅ Correct: Access data directly
const item = await provider.postListItem({ listName: "Stories", body });
console.log(item.Id); // Works

// ❌ Wrong: No 'd' wrapper exists
console.log(item.d.Id); // undefined
```

#### No LOCAL_MODE Logic in UI

```typescript
// ✅ Good: No if (LOCAL_MODE) checks needed
const stories = await provider.getListItems({ listName: "Stories" });

// ❌ Avoid: Scattered conditional logic
if (LOCAL_MODE) {
  stories = getMockStories();
} else {
  stories = await getStoriesFromSharePoint();
}
```

---

### Why This Pattern Works (Layer Isolation)

The lazy registration pattern breaks the circular dependency problem:

**Without Pattern (❌ Old Way):**

```
app-layer MockDataProvider
    ↓ imported by
app-layer provider-factory
    ↓ imported by
common-library code that tries to use getDataProvider()
    ↑ would import from
app-layer provider-factory
    ↑↑ CIRCULAR!
```

**With Pattern (✅ New Way):**

```
common-library provides empty registry
    ↑ app-layer registers impls at startup
    ↓
common-library getDataProvider() queries registry
    ↓ used by
any common-library code safely
    ↓ used by
app layer component via app-layer wrapper
    ↓ NO CIRCLES
```

**Key Insight:** Common-library never imports app layer. App layer only imports common-library. Clean one-way dependency.
}

````

---

## Common-Library Modules

### What Stays in Common-Library

Modules that are **reusable across projects**:

- **sharepoint-rest-api/** - REST functions, DataProvider implementations, types
- **analytics/** - Tracking integration
- **error-handling/** - Error boundaries, reporting
- **router/** - Navigation helpers
- **pwa/** - PWA integration
- **utils/** - Async state, generic utilities

### What Stays in App Layer

Modules that are **project-specific**:

- **data/** - MockDataProvider (extends base), provider factory, global state
- **env/** - SharePoint config (list names, URLs)
- **routes/** - App pages and features
- **types/** - Project domain types (Story, Engagement, etc.)

---

## Configuration Passing Pattern

### Problem

Common-library components that need app-specific configuration (like file upload destinations) should NOT import from the app layer. This breaks reusability across projects.

### Solution: Pass Configuration as Props/Context

Instead of importing `SHAREPOINT_CONFIG` directly in library components, pass it from the app layer:

**Example: EdraEditor File Upload**

App layer provides file upload handler via Svelte context:

```svelte
<!-- src/routes/stories/[id]/edit/_components/_content/EditStoryContent.svelte -->
<script>
  import { EdraEditor, EDRA_FILE_UPLOAD_KEY, type EdraFileUploadContext } from "$lib/common-library/integrations/components/edra-rich-text/shadcn";
  import { setContext } from "svelte";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { getDataProvider } from "$lib/data/data-providers/provider-factory";

  // Provide file upload context for the rich text editor placeholders
  setContext<EdraFileUploadContext>(EDRA_FILE_UPLOAD_KEY, {
    upload: async (file, state) => {
      state.setInprogress();

      const provider = getDataProvider();
      const response = await provider.readAndUploadFile({
        siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
        listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
        itemId: 0,
        file: file,
        folder: SHAREPOINT_CONFIG.folders.StoryFiles.name,
      });

      if ("error" in response) {
        state.setError("Upload failed: " + response.error);
        return { error: response.error };
      }

      state.setSuccess();
      return { url: file.name };
    },
  });
</script>

<EdraEditor bind:editor {content} {onUpdate} />
```

How it works internally:

1. **App layer** imports `SHAREPOINT_CONFIG` (app-specific)
2. **App layer** creates upload handler function with app-specific logic
3. **App layer** sets context via `setContext<EdraFileUploadContext>(EDRA_FILE_UPLOAD_KEY, { upload })`
4. **Placeholder components** (ImagePlaceholder, AudioPlaceholder, VideoPlaceholder) retrieve via `getContext<EdraFileUploadContext>(EDRA_FILE_UPLOAD_KEY)`
5. **Placeholder components** call `uploadContext.upload(file, state)` and handle the result
6. **Fallback behavior**: If no context is provided, placeholders use blob URLs (dev mode) or prompt for URL

**Benefits:**

- ✅ Library components don't import app config
- ✅ Components are truly reusable across projects
- ✅ Type-safe: `EdraFileUploadContext` interface ensures correct structure
- ✅ Flexible: Different callers can provide different upload implementations
- ✅ Graceful fallback: Works without context in dev mode

### Pattern for New Components

When creating library components that need app-specific behavior:

1. **Define context interface and symbol key** (in common-library)
   ```typescript
   // common-library/my-component/context.ts
   export interface MyComponentContext {
     doSomething: (input: Input) => Promise<Output>;
   }
   export const MY_COMPONENT_KEY = Symbol("my-component");
   ```

2. **Use getContext in child components** (in common-library)
   ```svelte
   <script>
     import { getContext } from "svelte";
     import { MY_COMPONENT_KEY, type MyComponentContext } from "./context";

     const ctx = getContext<MyComponentContext | undefined>(MY_COMPONENT_KEY);

     // Always handle the case where context is not provided
     if (!ctx) {
       // Fallback behavior
     }
   </script>
   ```

3. **Set context from app layer** (caller provides implementation)
   ```svelte
   <script>
     import { setContext } from "svelte";
     import { MY_COMPONENT_KEY, type MyComponentContext } from "$lib/common-library/my-component/context";

     setContext<MyComponentContext>(MY_COMPONENT_KEY, {
       doSomething: async (input) => {
         // App-specific implementation
         return result;
       },
     });
   </script>

   <MyComponent />
   ```

---

## Import Guidelines

### ✅ Good (Respects Layers)

```typescript
// UI code imports from app layer
import { getDataProvider } from "$lib/data/provider-factory";
import { global_State } from "$lib/data/global-state.svelte";

// App layer can import from common-library
import { BaseMockDataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/base-mock-data-provider";
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";

// Common-library imports from itself
import type { DataProvider } from "./data-provider";
````

### ❌ Avoid (Violates Layers)

```typescript
// ❌ Common-library should NOT import from app layer
import { global_State } from "$lib/data/global-state"; // NO
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config"; // NO (in most cases)

// ❌ Common-library should NOT import app-specific types
import type { Story_ListItem } from "$lib/data/types"; // NO
```

---

## Future Improvements (Issue #4-6)

### Currently Being Addressed

1. **Parameterize config** - Instead of importing `SHAREPOINT_CONFIG`, pass config as parameter
2. **Provider factory options** - Move factory to common-library with dependency injection
3. **Remove type dependencies** - Decouple common-library from app-layer types

### Benefits When Complete

- ✅ True portability: copy `common-library/` to another project and it works
- ✅ No app-layer imports needed in common-library
- ✅ Easier testing with custom implementations
- ✅ Clearer contract between layers

---

## Summary

| Aspect           | Common-Library                               | App Layer                      |
| ---------------- | -------------------------------------------- | ------------------------------ |
| **Purpose**      | Reusable code                                | Project-specific               |
| **Imports from** | Self only                                    | Common-library + self          |
| **Data**         | Generic SharePoint types                     | Project domain types           |
| **Config**       | Accepted as parameter                        | Defined & passed               |
| **Examples**     | BaseMockDataProvider, SharePointDataProvider | MockDataProvider, global state |

---
id: getting-started
label: Getting Started
description: Setup, installation, and first steps
keywords:
  - setup
  - install
  - configuration
  - prerequisites
  - start
---

# Getting Started

This guide helps you set up the starter project and configure it for your needs.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ and **pnpm** installed
- **Code editor** (VS Code recommended with Svelte extension)
- **SharePoint 2013 environment** (for production deployment)
- **Basic knowledge** of Svelte, TypeScript, and REST APIs

---

## Initial Setup

### 1. Download the Codebase

```bash
# Clone or download the starter repository
# (Replace with your actual repository path)
git clone <repository-url> my-project
cd my-project
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

The app will open at `http://localhost:5173` using mock data.

---

## Configure for Your Project

### Step 1: Define Your SharePoint Lists

Edit [src/lib/env/sharepoint-config.ts](../../src/lib/env/sharepoint-config.ts):

```typescript
export const SHAREPOINT_CONFIG = {
  info: {
    version: "Version 1",
    emails: {
      support: {
        email: "your-email@deloitte.com",
        subject: "Your Project: support request",
        // ...
      },
    },
  },
  lists: {
    // Define your lists here
    MyList: {
      name: "MyListName",  // Actual SharePoint list name
      schemas: {
        list: MyListSchema,  // Schema for items from SharePoint
        post: MyListPostSchema,  // Schema for creating items
      },
    },
    // Add more lists as needed
  },
  paths: {
    site_collection: SHAREPOINT_PATHS.site_collection,
    site: SHAREPOINT_PATHS.site,
    // ...
  },
} satisfies SharePointConfig;
```

**Important:** Keep list names in sync with your actual SharePoint lists!

### Step 2: Define Zod Schemas

Edit [src/lib/data/schemas.ts](../../src/lib/data/schemas.ts):

```typescript
import { z } from "zod";
import {
  Sharepoint_Default_Props_Schema,
  Sharepoint_Lookup_DefaultProps_Schema
} from "$lib/common-library/integrations";

// Define your schema
export const MyListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,  // Id, Created, Modified, etc.
  Title: z.string(),
  Description: z.string().optional(),
  Status: z.enum(["Active", "Archived"]),
  // For LookUp columns:
  Author: Sharepoint_Lookup_DefaultProps_Schema,
  Category: Sharepoint_Lookup_DefaultProps_Schema.optional(),
});

// Schema for creating items (no ID, Created, Modified)
export const MyListPostSchema = z.strictObject({
  Title: z.string().min(3, "Title must be at least 3 characters"),
  Description: z.string().optional(),
  Status: z.enum(["Active", "Archived"]),
  CategoryId: z.number().optional(),  // LookUp uses Id suffix
});
```

**Schema Best Practices:**
- Use `z.strictObject()` to catch typos
- Always extend `Sharepoint_Default_Props_Schema` for list items
- Use `Sharepoint_Lookup_DefaultProps_Schema` for LookUp columns
- Post schemas use `ColumnNameId` for LookUp references
- Add helpful validation messages

### Step 3: Derive TypeScript Types

Edit [src/lib/data/types.ts](../../src/lib/data/types.ts):

```typescript
import type z from "zod";
import { MyListSchema, MyListPostSchema } from "./schemas";

export type MyList_ListItem = z.infer<typeof MyListSchema>;
export type MyList_ListItem_Post = z.infer<typeof MyListPostSchema>;
```

Types are **automatically derived** from schemas - no manual typing needed!

### Step 4: Create Mock Data

Edit [src/lib/data/local-data.ts](../../src/lib/data/local-data.ts):

```typescript
import type { MyList_ListItem } from "./types";

export const LOCAL_MY_LIST_ITEMS: MyList_ListItem[] = [
  {
    Id: 1,
    Title: "Sample Item",
    Description: "This is a sample item",
    Status: "Active",
    Author: { Id: 1, Title: "John Doe" },
    Category: { Id: 1, Title: "General" },
    Created: "2025-01-01T10:00:00Z",
    Modified: "2025-01-05T15:30:00Z",
    // ... other default SharePoint props
  },
  // Add more mock items
];
```

**Mock Data Tips:**
- Match SharePoint's response structure exactly
- Include edge cases (empty strings, nulls, long text)
- Use realistic dates in ISO format
- Test with various LookUp values

### Step 5: Register Mock Data Provider

Edit [src/lib/data/data-providers/mock-data-provider.ts](../../src/lib/data/data-providers/mock-data-provider.ts):

```typescript
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { BaseMockDataProvider } from "$lib/common-library/integrations";
import { LOCAL_MY_LIST_ITEMS } from "../local-data";

type ListNames = AppSharePointConfig["lists"][keyof AppSharePointConfig["lists"]]["name"];
type MockDataMap = Record<ListNames, any[]>;

const MOCK_DATA_BY_LIST_NAME: MockDataMap = {
  [SHAREPOINT_CONFIG.lists.MyList.name]: LOCAL_MY_LIST_ITEMS,
  // TypeScript enforces all lists have entries
};

export class MockDataProvider extends BaseMockDataProvider {
  protected getDataForList(listName: string): any[] {
    return MOCK_DATA_BY_LIST_NAME[listName] ?? [];
  }
}
```

**Benefits:**
- TypeScript ensures all lists have mock data
- Automatic validation at compile time
- Easy to add new lists

### Step 6: Update SharePoint Paths (Production)

When deploying to SharePoint, update [src/lib/env/sharepoint-paths.ts](../../src/lib/env/sharepoint-paths.ts):

```typescript
// Detect paths at runtime based on current URL
const currentPath = window.location.pathname;

export const SHAREPOINT_PATHS = {
  site_collection: "/sites/YourSiteCollection",
  site: "/sites/YourSiteCollection/YourSubSite",
  // These will be detected automatically if following standard patterns
};
```

The codebase includes automatic path detection, but you can override for custom setups.

---

## Syncing with SharePoint

### Creating SharePoint Lists

For each list in your config, create it in SharePoint with:

1. **Correct list name** (matches `SHAREPOINT_CONFIG.lists.*.name`)
2. **Required columns**:
   - Title (built-in)
   - Any custom columns from your schema
   - LookUp columns properly configured

3. **Column types**:
   - Single line of text → `z.string()`
   - Multiple lines of text → `z.string()`
   - Number → `z.number()`
   - Yes/No → `z.boolean()`
   - Date and Time → `z.string()` (ISO format)
   - Person or Group → `Sharepoint_Lookup_DefaultProps_Schema`
   - Lookup → `Sharepoint_Lookup_DefaultProps_Schema`

### Handling LookUp Columns

**In SharePoint:**
- Column name: `Category`
- Type: Lookup
- Get information from: `Categories` list
- In this column: `Title`

**In Schema (List):**
```typescript
Category: Sharepoint_Lookup_DefaultProps_Schema,
// Returns: { Id: 1, Title: "General" }
```

**In Schema (Post):**
```typescript
CategoryId: z.number(),  // Note the "Id" suffix
```

**When fetching:**
```typescript
const items = await provider.getListItems({
  listName: "MyList",
  operations: [
    ["select", "Id,Title,Category/Id,Category/Title"],
    ["expand", "Category"],  // Required for LookUp columns!
  ],
});
```

### Index Columns for Performance

SharePoint enforces a **5000-item threshold** on queries. To bypass:

1. **Index frequently queried columns** in SharePoint list settings
2. **Filter on indexed columns** first
3. **Use pagination** for large lists (see [SharePoint Integration](/docs/sharepoint))

---

## Folder Structure You'll Modify

When starting a new project, you'll mainly work in:

```
src/lib/
├── data/
│   ├── schemas.ts              ← Define your schemas
│   ├── types.ts                ← Derive types
│   ├── local-data.ts           ← Create mock data
│   └── data-providers/
│       └── mock-data-provider.ts  ← Register mock data
├── env/
│   ├── sharepoint-config.ts    ← Configure lists & paths
│   └── sharepoint-paths.ts     ← Production paths
└── routes/
    └── your-pages.svelte       ← Build your UI
```

**Don't modify:** `src/lib/common-library/` (reusable across projects)

---

## Development Workflow

### 1. Define Schema & Mock Data
```bash
# Edit schemas.ts, types.ts, local-data.ts
pnpm check  # Verify types
```

### 2. Build UI with Mock Data
```bash
pnpm dev  # Uses mock data on localhost
```

### 3. Test with SharePoint
```bash
# Create SharePoint lists
# Deploy to SharePoint folder
# App automatically switches to SharePoint REST API
```

### 4. Iterate
- Add features with mock data
- Test on localhost
- Deploy to SharePoint
- Repeat

---

## Common Tasks

### Adding a New List

1. Create schema in `schemas.ts`
2. Derive type in `types.ts`
3. Add mock data in `local-data.ts`
4. Register in `mock-data-provider.ts`
5. Add to `sharepoint-config.ts`
6. Create actual list in SharePoint
7. Verify with `pnpm check`

### Fetching Data

```typescript
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

const provider = getDataProvider();
const response = await provider.getListItems({
  listName: "MyList",
  operations: [
    ["select", "Id,Title,Author/Title"],
    ["expand", "Author"],
    ["filter", "Status eq 'Active'"],
    ["orderby", "Created desc"],
    ["top", 10],
  ],
  signal,  // For cancellation
});

if (!("error" in response)) {
  const items = response.value;  // Typed as MyList_ListItem[]
}
```

### Creating Items

```typescript
const newItem = {
  Title: "New Item",
  Description: "Description",
  Status: "Active",
  CategoryId: 1,
};

const response = await provider.postListItem({
  listName: "MyList",
  body: newItem,
  signal,
});
```

---

## Validation & Type Safety

The starter enforces type safety at multiple levels:

1. **Runtime validation** with Zod schemas
2. **Compile-time types** derived from schemas
3. **Config validation** on app startup
4. **Mock data validation** via TypeScript

If something is wrong, you'll know immediately:
- **Development:** TypeScript errors in IDE
- **Runtime:** Zod validation errors with clear messages
- **Startup:** Config validation catches misconfigurations

---

## Next Steps

Now that you're set up:

1. **[Core Concepts](/docs/core-concepts)** - Understand the architecture
2. **[SharePoint Integration](/docs/sharepoint)** - Learn SharePoint patterns
3. **[Examples & Routes](/docs/examples)** - Study working implementations
4. **[State Management](/docs/state)** - Handle async operations

---

## Troubleshooting

### Mock Data Not Loading
- Check `MOCK_DATA_BY_LIST_NAME` includes your list name
- Verify list name matches `SHAREPOINT_CONFIG.lists.*.name`
- Look for console errors

### Type Errors
- Run `pnpm check` to see all type issues
- Ensure schemas are exported from `schemas.ts`
- Verify types are derived in `types.ts`

### SharePoint Connection Issues
- Check FormDigest is being fetched (see Network tab)
- Verify `sharepoint-paths.ts` has correct site URLs
- Ensure CORS/authentication is configured in SharePoint

### Schema Validation Fails
- Check mock data matches schema exactly
- Look for missing required fields
- Verify LookUp column structure: `{ Id: number, Title: string }`

---

**Ready to build?** Check out [Examples & Routes](/docs/examples) to see how everything works together!

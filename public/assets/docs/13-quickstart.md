---
id: quickstart
label: Quickstart
description: Build your first feature in 15 minutes
keywords:
  - quickstart
  - tutorial
  - first-feature
  - crud
  - example
---

# Quickstart: Build Your First Feature

Build a complete CRUD feature from scratch in 15 minutes. You'll learn the essential patterns by doing.

**What we'll build:** A simple "Tasks" list with create, read, update, delete functionality.

---

## Prerequisites

- Project already set up (see [Getting Started](01-getting-started.md))
- `pnpm dev` running on localhost
- Basic understanding of Svelte 5

---

## Step 1: Define Your Schema (2 minutes)

Add your Zod schema to `src/lib/data/schemas.ts`:

```typescript
// Add to existing file
export const TaskSchema = z.strictObject({
  Title: z.string().min(3, "Task name must be at least 3 characters."),
  Description: z.string().max(500, "Description must be 500 characters or less."),
  Status: z.enum(["Todo", "InProgress", "Done"]),
  Priority: z.enum(["Low", "Medium", "High"]),
});

export const TaskListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...TaskSchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

export const TaskPostSchema = z.strictObject({
  ...TaskSchema.shape,
});
```

**Export types** in `src/lib/data/types.ts`:

```typescript
export type Task_ListItem = z.infer<typeof TaskListSchema>;
export type Task_ListItem_Post = z.infer<typeof TaskPostSchema>;
```

---

## Step 2: Add to SharePoint Config (1 minute)

Update `src/lib/env/sharepoint-config.ts`:

```typescript
export const SHAREPOINT_CONFIG = {
  // ... existing config
  lists: {
    // ... existing lists
    Tasks: {
      name: "TasksList",
      schemas: {
        list: TaskListSchema,
        post: TaskPostSchema,
      },
    },
  },
} satisfies SharePointConfig;
```

---

## Step 3: Create Mock Data (2 minutes)

Add mock data to `src/lib/data/local-data.ts`:

```typescript
export const LOCAL_DATA = {
  // ... existing data
  TasksList: [
    {
      Id: 1,
      Title: "Setup development environment",
      Description: "Install Node.js, pnpm, and clone repository",
      Status: "Done",
      Priority: "High",
      Author: { Id: 1, Title: "John Doe" },
      Created: "2025-01-01T10:00:00Z",
      Modified: "2025-01-01T10:00:00Z",
    },
    {
      Id: 2,
      Title: "Read documentation",
      Description: "Go through all documentation files",
      Status: "InProgress",
      Priority: "Medium",
      Author: { Id: 1, Title: "John Doe" },
      Created: "2025-01-02T10:00:00Z",
      Modified: "2025-01-02T14:30:00Z",
    },
    {
      Id: 3,
      Title: "Build first feature",
      Description: "Follow quickstart guide",
      Status: "Todo",
      Priority: "High",
      Author: { Id: 1, Title: "John Doe" },
      Created: "2025-01-03T09:00:00Z",
      Modified: "2025-01-03T09:00:00Z",
    },
  ],
};
```

**Important:** Mock data won't be in production builds (automatically tree-shaken).

---

## Step 4: Create Route Structure (1 minute)

```bash
mkdir -p src/routes/tasks
mkdir -p src/lib/data/items/tasks
touch src/routes/tasks/index.svelte
touch src/lib/data/items/tasks/api.ts
touch src/lib/data/items/tasks/index.ts
```

---

## Step 5: Fetch Data (3 minutes)

Create `src/lib/data/items/tasks/api.ts`:

```typescript
import { createSelectExpandQueries, type Sharepoint_Get_Operations } from "$lib/common-library/integrations";
import { createNew_Task_ListItem } from "$lib/data/new-items.svelte";
import type { Task_ListItem } from "$lib/data/types";
import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

export async function getTasks(loadState: AsyncLoadState, signal?: AbortSignal): Promise<Task_ListItem[] | undefined> {
  const selectExpand = createSelectExpandQueries(createNew_Task_ListItem());

  const operations: Sharepoint_Get_Operations = [
    ["select", selectExpand.select],
    ["expand", selectExpand.expand],
    ["orderby", "Created desc"],
  ];

  const provider = getDataProvider();
  const response = await provider.getListItems<{ value: Task_ListItem[] }>({
    listName: SHAREPOINT_CONFIG.lists.Tasks.name,
    operations,
    signal,
  });

  if ("error" in response) {
    loadState.setError("Failed to load tasks: " + response.error);
    return undefined;
  }

  loadState.setReady();
  return response.value;
}
```

**Add new item creator** to `src/lib/data/new-items.svelte.ts`:

```typescript
export function createNew_Task_ListItem(): Task_ListItem {
  return {
    Id: 0,
    Title: "",
    Description: "",
    Status: "Todo",
    Priority: "Medium",
    Author: { Id: 0, Title: "" },
    Created: "",
    Modified: "",
  };
}
```

---

## Step 6: Build the UI (5 minutes)

Create `src/routes/tasks/index.svelte`:

```svelte
<script lang="ts">
  import { getTasks } from "$lib/data/items/tasks";
  import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";
  import type { Task_ListItem } from "$lib/data/types";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";

  const { signal } = useAbortController();
  let tasks: Task_ListItem[] = $state([]);
  const loadState = new AsyncLoadState();

  $effect(() => {
    loadTasks();
  });

  async function loadTasks() {
    loadState.setLoading();
    const result = await getTasks(loadState, signal);
    if (result) tasks = result;
  }

  function getPriorityColor(priority: string) {
    return {
      High: "text-red-600",
      Medium: "text-yellow-600",
      Low: "text-green-600",
    }[priority] || "";
  }

  function getStatusBadge(status: string) {
    return {
      Todo: "bg-gray-200 text-gray-800",
      InProgress: "bg-blue-200 text-blue-800",
      Done: "bg-green-200 text-green-800",
    }[status] || "";
  }
</script>

<svelte:boundary>
  {#snippet failed(error, reset)}
    <ErrorBoundaryMessage customError="Error loading tasks" {error} {reset} />
  {/snippet}

  <main class={cn(PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
    <h1 class="text-3xl font-bold mb-6">Tasks</h1>

    <StatusMessage state={loadState} />

    {#if loadState.ready && tasks.length > 0}
      <div class="grid gap-4">
        {#each tasks as task (task.Id)}
          <div class="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold">{task.Title}</h3>
              <span class={cn("px-2 py-1 rounded text-xs font-medium", getStatusBadge(task.Status))}>
                {task.Status}
              </span>
            </div>
            <p class="text-muted-foreground mb-3">{task.Description}</p>
            <div class="flex items-center gap-4 text-sm">
              <span class={cn("font-medium", getPriorityColor(task.Priority))}>
                {task.Priority} Priority
              </span>
              <span class="text-muted-foreground">
                By {task.Author.Title}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {:else if loadState.ready}
      <p class="text-muted-foreground">No tasks yet. Add your first task!</p>
    {/if}
  </main>
</svelte:boundary>
```

---

## Step 7: Test It! (1 minute)

1. Navigate to `http://localhost:5173/#/tasks`
2. You should see your 3 mock tasks displayed
3. Try refreshing - data persists in session storage

---

## What You've Learned

✅ **Schema-driven development** - Types flow from Zod to UI  
✅ **Provider pattern** - Same code works with mock and SharePoint  
✅ **Async state management** - Loading, error, ready states  
✅ **Request cancellation** - Clean unmount with abort signals  
✅ **Error boundaries** - Graceful error handling  
✅ **Type safety** - End-to-end TypeScript

---

## Next Steps

### Add Create Functionality

```typescript
// In api.ts
export async function createTask(submitState: AsyncSubmitState, taskData: Task_ListItem_Post): Promise<boolean> {
  submitState.setInprogress();

  const provider = getDataProvider();
  const response = await provider.postListItem({
    listName: SHAREPOINT_CONFIG.lists.Tasks.name,
    body: taskData,
  });

  if ("error" in response) {
    submitState.setError("Failed to create task: " + response.error);
    return false;
  }

  submitState.setSuccess("Task created successfully!");
  return true;
}
```

### Add Update/Delete

See [Examples & Routes](04-examples.md) for complete CRUD patterns in the stories feature.

---

## Deploy to SharePoint

1. **Create SharePoint List:**

   - Name: `TasksList`
   - Columns: Title (text), Description (text), Status (choice), Priority (choice)

2. **Build for production:**

   ```bash
   pnpm build
   ```

3. **Upload to SharePoint:**

   - Copy `dist/` contents to SharePoint folder
   - Access via `https://your-sharepoint-site/folder/index.html`

4. **It just works!** Provider automatically switches to SharePoint REST API.

---

## Troubleshooting

**Q: Types not updating?**  
A: Run `pnpm check` to see TypeScript errors

**Q: Data not showing?**  
A: Check browser console for errors, verify LOCAL_DATA structure

**Q: Changes not persisting?**  
A: Mock data uses sessionStorage - clear storage or restart browser

**Need help?** See [Core Concepts](02-core-concepts.md) or [Error Handling](07-error-handling.md)

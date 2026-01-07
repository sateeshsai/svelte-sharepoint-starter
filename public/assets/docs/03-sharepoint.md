---
id: sharepoint
label: SharePoint Integration
description: REST API patterns, LookUp columns, limits, best practices, quirks
keywords:
  - sharepoint
  - rest-api
  - lookup
  - formdigest
  - odata
  - pagination
  - indexing
  - threshold
---

# SharePoint Integration

Complete guide to working with SharePoint 2013 REST API in this starter.

---

## REST API Basics

### odata=nometadata Format

All API calls use `odata=nometadata` for cleaner, smaller responses:

**Headers:**

```javascript
{
  "Accept": "application/json;odata=nometadata",
  "Content-Type": "application/json;odata=nometadata"
}
```

**Benefits:**

- ✅ 30-40% smaller response size
- ✅ No `__metadata` clutter
- ✅ Cleaner JSON structure
- ✅ Easier to work with

**Response format:**

```json
{
  "value": [
    {
      "Id": 1,
      "Title": "Item Title",
      "Created": "2025-01-01T10:00:00Z"
    }
  ]
}
```

**Note:** When using `odata=nometadata`, do NOT include `__metadata` in POST/UPDATE request bodies.

---

## FormDigest Values

SharePoint requires a **FormDigest** security token for all write operations (POST, UPDATE, DELETE).

### What is FormDigest?

A security token that:

- Prevents CSRF attacks
- **Expires after inderminate amount of time** (varies by server config)
- Required for all write operations
- Not needed for GET requests

### How It's Handled

The starter **automatically manages FormDigest**:

```typescript
// You don't do this manually - it's handled for you
const digest = await provider.getFormDigestValue({
  siteUrl: SHAREPOINT_CONFIG.paths.site,
});

// Then used in write operations
await fetch(url, {
  headers: {
    "X-RequestDigest": digest,
    // ...
  },
});
```

### FormDigest Best Practices

**DO:**

- ✅ Let the provider handle it automatically
- ✅ Expect occasional failures due to timeouts

**DON'T:**

- ❌ Cache FormDigest yourself
- ❌ Assume it's always valid
- ❌ Use same digest across different sites

---

## LookUp Columns (Relational Data)

SharePoint uses **LookUp columns** for relationships between lists.

### Understanding LookUp Columns

**In SharePoint List Settings:**

- Column name: `Author`
- Type: Lookup (or Person or Group)
- Get information from: `Users` list
- In this column: `Title`

**In API responses:**

```json
{
  "Id": 1,
  "Title": "My Story",
  "Author": { "Id": 5, "Title": "John Doe" },
  "Category": { "Id": 2, "Title": "Technology" }
}
```

### Schema Definition

**For list items (GET):**

```typescript
import { Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations";

export const StorySchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  Title: z.string(),
  Author: Sharepoint_Lookup_DefaultProps_Schema, // { Id, Title }
  Category: Sharepoint_Lookup_DefaultProps_Schema.optional(),
});
```

**For creating items (POST):**

```typescript
export const StoryPostSchema = z.strictObject({
  Title: z.string(),
  AuthorId: z.number(), // Use "Id" suffix!
  CategoryId: z.number().optional(),
});
```

**Key difference:** GET uses `Author`, POST uses `AuthorId`.

### Fetching Items with LookUp Columns

**Must use `expand` and `select`:**

```typescript
const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    // Select fields: use "LookUpColumn/Field" format
    ["select", "Id,Title,Author/Id,Author/Title,Category/Id,Category/Title"],

    // Expand LookUp columns (required!)
    ["expand", "Author,Category"],
  ],
  signal,
});
```

**Without expand:**

```json
{
  "Author": { "Id": 5 } // ❌ Missing Title
}
```

**With expand:**

```json
{
  "Author": { "Id": 5, "Title": "John Doe" } // ✅ Complete
}
```

### Creating Items with LookUp References

```typescript
const newStory = {
  Title: "New Story",
  Content: "Story content...",
  AuthorId: 5, // Reference by Id (note "Id" suffix)
  CategoryId: 2,
};

await provider.postListItem({
  listName: "Stories",
  body: newStory,
  signal,
});
```

### Multi-Level LookUps

For LookUps that reference other LookUps:

```typescript
// Story → Category → Parent Category
const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title,Category/Id,Category/Title,Category/Parent/Title"],
    ["expand", "Category,Category/Parent"], // Multi-level expand
  ],
});
```

### LookUp Best Practices

**DO:**

- ✅ Always use `expand` when fetching LookUp columns
- ✅ Use `ColumnNameId` in POST schemas
- ✅ Select specific fields: `Author/Id,Author/Title`
- ✅ Handle cases where LookUp might be null

**DON'T:**

- ❌ Forget to expand (you'll get incomplete data)
- ❌ Use `LookupColumnName` in POST body (use `LookupColumnNameId`)
- ❌ Assume LookUp is always populated

---

## The 5000-Item Threshold

SharePoint enforces a **5000-item query threshold** for performance.

### What Happens at 5000 Items?

Queries that scan more than 5000 items will **fail** unless:

- You filter on an **indexed column** first
- You use pagination (handled automatically by this starter)

### Solution: Index Your Columns

**In SharePoint List Settings:**

1. Go to List Settings → Indexed Columns
2. Create index on frequently filtered columns:
   - Status (if filtering by status)
   - Created (for date ranges)
   - Author (if filtering by user)
   - Custom columns you query often

**Best practice:** Index any column used in `filter` operations.

### Pagination for Large Lists

When fetching large lists, use pagination:

```typescript
async function getAllItems(listName: string, batchSize: number = 500): Promise<any[]> {
  let allItems: any[] = [];
  let skip = 0;

  while (true) {
    const response = await provider.getListItems({
      listName,
      operations: [
        ["top", batchSize],
        ["skip", skip],
        ["orderby", "Id"], // Consistent ordering required
      ],
    });

    if (!("error" in response)) {
      const batch = response.value;
      if (batch.length === 0) break;

      allItems = [...allItems, ...batch];
      skip += batchSize;

      if (batch.length < batchSize) break; // Last page
    } else {
      break;
    }
  }

  return allItems;
}
```

**Pagination best practices:**

- ✅ Use `top` and `skip` for batches
- ✅ Keep batch size ≤ 1000 items
- ✅ Always use `orderby` for consistent results
- ✅ Filter on indexed columns first
- ✅ Show loading progress to users

### Recursive Fetching Example

See [/routes/admin](/docs/examples#admin-dashboard) for a working implementation of recursive fetching with progress indication.

---

## OData Operations

The starter supports standard OData query operations:

### Select (Choose Fields)

```typescript
["select", "Id,Title,Created,Author/Title"];
```

**Tips:**

- Only request fields you need (faster queries)
- Use `ColumnName/Field` for LookUp columns
- Don't use `*` with LookUp columns

### Expand (Resolve LookUps)

```typescript
["expand", "Author,Category"];
```

**Required for:**

- Getting LookUp column details
- Person or Group fields
- Multi-level LookUps

### Filter

```typescript
["filter", "Status eq 'Active' and CategoryId eq 2"];
```

**Operators:**

- `eq` (equals), `ne` (not equals)
- `gt` (greater than), `lt` (less than)
- `ge` (≥), `le` (≤)
- `and`, `or`, `not`
- `startswith`, `substringof`, `endswith`

**Date filters:**

```typescript
["filter", "Created ge datetime'2025-01-01T00:00:00Z'"];
```

**Filter on indexed columns first** to avoid threshold issues.

### Order By

```typescript
["orderby", "Created desc"][("orderby", "Title asc,Modified desc")];
```

### Top & Skip (Pagination)

```typescript
["top", 50][("skip", 50)][("top", 100)]; // First 50 items // Skip first 50 // Then get 100
```

### Example: Complex Query

```typescript
const response = await provider.getListItems({
  listName: "Stories",
  operations: [
    ["select", "Id,Title,Created,Author/Title,Category/Title"],
    ["expand", "Author,Category"],
    ["filter", "Status eq 'Published' and Created ge datetime'2025-01-01T00:00:00Z'"],
    ["orderby", "Created desc"],
    ["top", 20],
  ],
  signal,
});
```

---

## Common SharePoint Quirks

### 1. Column Name Encoding

SharePoint changes column names with spaces:

```
SharePoint Display Name   → Internal Name
"Project Name"           → "Project_x0020_Name"
"End Date"               → "End_x0020_Date"
```

**Solution:** Use internal names in API calls:

```typescript
["select", "Project_x0020_Name,End_x0020_Date"];
```

**Or better:** Create columns without spaces in the first place.

### 2. Person or Group Fields

Person or Group columns work like LookUps:

```typescript
export const ItemSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  AssignedTo: Sharepoint_Lookup_DefaultProps_Schema, // Person field
});

// Fetch with expand
["select", "Id,Title,AssignedTo/Title,AssignedTo/EMail"], ["expand", "AssignedTo"];
```

**Get user email:**

```typescript
["select", "AssignedTo/EMail"];
```

### 3. Multi-Choice Fields

Multi-choice columns return as:

```json
{
  "Tags": { "results": ["Tag1", "Tag2", "Tag3"] }
}
```

**Schema:**

```typescript
Tags: z.object({
  results: z.array(z.string()),
}).optional();
```

### 4. Managed Metadata (Taxonomy)

Managed metadata fields are complex. Recommended approach:

```typescript
// Use a helper list to map term IDs to labels
// Or work with the raw term GUID returned
```

### 5. Attachment Files

List item attachments require separate API calls:

```typescript
// Get attachments for an item
const attachments = await fetch(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles`);
```

This starter includes **dedicated file handling** via a separate `Files` list (see examples).

### 6. Created/Modified Dates

Always in ISO 8601 format:

```typescript
"Created": "2025-01-15T10:30:00Z"
```

**Parsing:**

```typescript
const date = new Date(item.Created);
```

**Filtering:**

```typescript
["filter", "Created ge datetime'2025-01-01T00:00:00Z'"];
```

---

## Error Handling

SharePoint API errors follow this structure:

```json
{
  "error": {
    "code": "-1, Microsoft.SharePoint.Client.InvalidClientQueryException",
    "message": {
      "lang": "en-US",
      "value": "The field 'InvalidColumn' does not exist."
    }
  }
}
```

The starter automatically formats these:

```typescript
// Formatted error
{
  error: true,
  message: "The field 'InvalidColumn' does not exist.",
  code: "InvalidClientQueryException",
  statusCode: 400
}
```

**Common error codes:**

- `404` - List or item not found
- `403` - Permission denied
- `400` - Invalid query (bad field name, syntax error)
- `500` - Server error (FormDigest timeout, threshold exceeded)

---

## Request Deduplication

The starter automatically **deduplicates identical requests**:

```typescript
// These fire simultaneously in different components
const req1 = provider.getListItems({ listName: "Stories" });
const req2 = provider.getListItems({ listName: "Stories" });

// Only ONE actual API call is made
// Both components get the same response
```

**Benefits:**

- ✅ Reduces unnecessary API calls
- ✅ Faster page loads
- ✅ Less server load

**How it works:**

- Identical requests (same URL, same params) share a single Promise
- When response arrives, all waiting consumers get it
- Cache expires after request completes

---

## Request Cancellation

Use `AbortController` to cancel requests:

```typescript
import { useAbortController } from "$lib/hooks/useAbortController.svelte";

const { signal, abort } = useAbortController();

// Pass signal to requests
const response = await provider.getListItems({
  listName: "Stories",
  signal, // ← Request can be cancelled
});

// When component unmounts or route changes
onDestroy(() => {
  abort(); // Cancels pending requests
});
```

**Benefits:**

- ✅ No memory leaks from completed requests
- ✅ Faster route transitions
- ✅ Reduced server load

**Example:** [/routes/stories](/docs/examples#stories-list) demonstrates cancellation on unmount.

---

## Rate Limiting & Throttling

SharePoint may throttle requests if you:

- Make too many requests too quickly
- Query during peak hours
- Exceed resource quotas

**Best practices:**

- ✅ Use request deduplication (automatic)
- ✅ Batch operations when possible
- ✅ Add delays in polling loops (10s for production)
- ✅ Cache data on client side
- ✅ Index columns to avoid threshold hits

**Polling example:**

```typescript
// In production, poll every 10 seconds (not 2s!)
const pollInterval = LOCAL_MODE ? 2000 : 10000;

poll(async () => {
  const newItems = await fetchNewItems();
  // ...
}, pollInterval);
```

See [/routes/stories](/docs/examples#stories-list) for polling implementation.

---

## Best Practices Summary

### DO ✅

- **Index columns** you filter/sort on
- **Expand LookUp columns** when fetching
- **Use `top` and `skip`** for large lists
- **Filter on indexed columns first**
- **Pass `signal`** for cancellation
- **Handle FormDigest timeouts** with retry logic
- **Use `odata=nometadata`** for smaller responses
- **Keep batch sizes ≤ 1000 items**
- **Test with realistic data volumes**

### DON'T ❌

- **Query without indexes** on columns you filter
- **Forget to expand** LookUp columns
- **Fetch all items at once** from large lists
- **Use `*` in select** with LookUp columns
- **Cache FormDigest tokens** manually
- **Poll too frequently** (causes throttling)
- **Ignore threshold errors** (index your columns!)
- **Trust that queries will succeed** (always handle errors)

---

## Learning Resources

### Official Microsoft Documentation

- [SharePoint 2013 REST API Reference](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [OData Query Operations](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/use-odata-query-operations-in-sharepoint-rest-requests)
- [Working with Lists](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest)
- [FormDigest Tokens](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/complete-basic-operations-using-sharepoint-rest-endpoints)

### Community Resources

- [SharePoint Stack Exchange](https://sharepoint.stackexchange.com/)
- [PnP Core Documentation](https://pnp.github.io/pnpcore/)

---

## Testing Against SharePoint

### Development Workflow

1. **Build UI with mock data** (localhost)
2. **Create SharePoint lists** matching your schemas
3. **Deploy to test folder** in SharePoint
4. **Verify API integration** works
5. **Check error handling** (try invalid queries)
6. **Test with realistic data volumes**
7. **Monitor for threshold errors**

### Common Issues During Testing

**API returns empty array:**

- Check list name matches config
- Verify filter syntax is correct
- Ensure column names are correct (internal names)

**LookUp columns are incomplete:**

- Add missing `expand` operation
- Check `select` includes LookUp fields

**Threshold error (5000 items):**

- Index the columns you filter on
- Use pagination with `top` and `skip`
- Filter on indexed columns first

**FormDigest timeout:**

- Implement retry logic
- Check SharePoint timeout settings
- Ensure site URL is correct

---

## Next Steps

- **[State Management](/docs/state)** - Handle async loading & forms
- **[Error Handling](/docs/errors)** - Error boundaries & reporting
- **[Examples](/docs/examples)** - See SharePoint integration in action
- **[API Integration](/docs/api)** - Detailed provider documentation

---

## Quick Reference

| Task        | Code                                                  |
| ----------- | ----------------------------------------------------- |
| Basic fetch | `provider.getListItems({ listName: "Stories" })`      |
| With LookUp | `operations: [["expand", "Author"]]`                  |
| Filter      | `["filter", "Status eq 'Active'"]`                    |
| Pagination  | `["top", 50], ["skip", 100]`                          |
| Create item | `provider.postListItem({ listName, body })`           |
| Update item | `provider.updateListItem({ listName, itemId, body })` |
| Delete item | `provider.deleteListItem({ listName, itemId })`       |

**Remember:** Keep your SharePoint lists in sync with your schemas!

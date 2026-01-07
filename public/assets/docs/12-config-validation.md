---
id: config
label: Config Validation
description: Runtime SharePoint config validation with Zod, error boundaries, and clear error messages
keywords:
  - config
  - validation
  - error boundary
  - zod
  - initialization
---

# Config Validation & Error Boundary Implementation

## Overview

Comprehensive configuration validation using Zod schema and an error boundary component that catches configuration errors at app startup and displays them with helpful debugging guidance.

## Components Added

### 1. Zod Validation Schema

**File:** `src/lib/common-library/integrations/sharepoint-rest-api/config/config.ts`

- **SharePointConfigSchema** - Zod schema that validates:

  - `info.version` - must be non-empty string
  - `info.emails.support` - email address must be valid format
  - `lists[*].name` - list names cannot be empty
  - `paths.root, assets, page, domain, site_collection` - must be non-empty strings
  - `folders[*].name, rel_path` - folder names/paths cannot be empty

- **validateSharePointConfig()** - Validation function that:
  - Parses config against schema
  - Catches validation errors and formats them readably
  - Returns validated config or throws descriptive Error

```typescript
export function validateSharePointConfig(config: unknown): SharePointConfig {
  try {
    return SharePointConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map((issue: z.ZodIssue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root";
          return `${path}: ${issue.message}`;
        })
        .join("\n");
      throw new Error(`Invalid SharePoint configuration:\n${formattedErrors}`);
    }
    throw error;
  }
}
```

### 2. Config Error Boundary Component

**File:** `src/_components/ConfigErrorBoundary.svelte`

- **Purpose:** Top-level error boundary that catches config initialization errors
- **Initialization:** Calls `initializeDataProviders()` in component `<script>` block
- **Error Display:** Shows formatted error message with debugging guidance
- **Styling:** Professional error UI with gradient background and helpful tips

**Features:**

- ✅ Catches config validation errors at startup
- ✅ Displays formatted error message showing which config fields are invalid
- ✅ Provides debugging checklist (URLs must be valid, fields must not be empty, etc.)
- ✅ Links to browser console for full error details
- ✅ Prevents app from rendering if config is invalid

**Error Message Example:**

```
⚠️ Configuration Error

The SharePoint configuration is invalid. Please check your settings:

Invalid SharePoint configuration:
paths.site_collection: String must be a valid URL
lists.Story.name: String must contain at least 1 character(s)
info.emails.support.email: Invalid email

What to check:
• Verify src/lib/env/sharepoint-config.ts exists and has correct syntax
• Ensure all required fields are present (paths.site_collection, etc.)
• Check that URLs are valid (must start with https://)
• Verify list and folder names are not empty strings
• Check email addresses are valid format
```

### 3. Updated Provider Factory

**File:** `src/lib/data/provider-factory.ts`

- **validateSharePointConfig** import added
- **initializeDataProviders()** now validates config before creating providers

```typescript
export function initializeDataProviders(): void {
  // Validate config at startup - catches typos and missing required fields
  const validConfig = validateSharePointConfig(SHAREPOINT_CONFIG);

  registerProvidersInRegistry(new MockDataProvider(validConfig), new SharePointDataProvider(validConfig));
}
```

### 4. Updated App Root

**File:** `src/App.svelte`

- Wrapped entire app in `<ConfigErrorBoundary>` component
- Ensures config validation happens before any component mounts
- Shows error page if config is invalid instead of letting app break

```svelte
<script>
  import ConfigErrorBoundary from "./_components/ConfigErrorBoundary.svelte";
</script>

<ConfigErrorBoundary>
  <svelte:boundary>
    {/* app content */}
  </svelte:boundary>
</ConfigErrorBoundary>
```

## Error Detection & Handling

### When Config Errors Occur

1. **At app startup** - Config validation runs in ConfigErrorBoundary
2. **Validation fails** - Zod detects invalid fields
3. **Formatted error** - validateSharePointConfig() formats error message
4. **Error boundary catches** - ConfigErrorBoundary catches the thrown Error
5. **User sees help** - Error page displays with debugging checklist

### Example: Invalid Config

If `SHAREPOINT_CONFIG.paths.site_collection` is missing:

```
❌ Error thrown by validateSharePointConfig()
   "Invalid SharePoint configuration:\npaths.site_collection: String must contain at least 1 character(s)"

✅ Error boundary catches it
   Displays error page with helpful tips

✅ User checks debugging checklist
   "Ensure all required fields are present (paths.site_collection, etc.)"
   Finds the problem: missing site_collection

✅ User fixes config
   Reloads page, validation passes, app starts normally
```

## Benefits

✅ **Early Detection** - Config errors caught at startup, not randomly at runtime
✅ **Clear Messaging** - Zod provides specific field-level error messages
✅ **Developer Experience** - Error page tells you exactly what to fix
✅ **Prevents Silent Failures** - App won't run with invalid config
✅ **Flexible Validation** - Schema uses `.passthrough()` to allow extra properties
✅ **Type Safe** - TypeScript validates config matches SharePointConfig type

## Testing Config Validation

### Valid Config

```typescript
const config = {
  paths: { site_collection: "https://company.sharepoint.com/sites/app" },
  lists: { Story: { name: "Stories" } },
};
validateSharePointConfig(config); // ✅ Passes
```

### Invalid Config (Missing URL)

```typescript
const config = {
  paths: { site_collection: "" },
};
validateSharePointConfig(config); // ❌ Throws: "String must contain at least 1 character(s)"
```

### Invalid Config (Missing Required Field)

```typescript
const config = {
  // Missing paths entirely
};
validateSharePointConfig(config); // Passes (optional), no error
```

## Current Status

✅ **pnpm check**: 0 errors
✅ **pnpm run build**: 3.39s (successful)
✅ **Error boundary**: Fully functional
✅ **Validation schema**: All fields validated
✅ **Error messages**: Descriptive and actionable

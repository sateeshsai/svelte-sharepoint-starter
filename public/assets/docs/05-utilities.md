---
id: utils
label: Utilities
description: String, file, time, number, and object helpers
keywords:
  - utils
  - helper
  - function
  - string
  - file
  - date
  - time
  - format
---

# Utilities Reference

All utilities are located in `src/lib/common-library/utils/` and `src/lib/utils.ts`.

**See also:** [Examples](/docs/examples) (utilities in action) | [Components](/docs/components) (UI helpers)

---

## String Utilities

Located in `src/lib/common-library/utils/functions/`

### `capitalizeFirstLetter()`

Capitalize first character of string.

```ts
capitalizeFirstLetter(str: string): string

capitalizeFirstLetter("hello"); // "Hello"
capitalizeFirstLetter("WORLD"); // "WORLD"
```

### `truncate()`

Truncate string to specified length with optional suffix.

```ts
truncate(str: string, length: number, suffix?: string): string

truncate("Hello World", 5, "..."); // "Hello..."
truncate("Short", 10); // "Short" (no truncation)
```

### `removeSpecialCharacters()`

Remove special characters, keep alphanumeric and spaces.

```ts
removeSpecialCharacters(str: string): string

removeSpecialCharacters("Hello@World#123"); // "HelloWorld123"
removeSpecialCharacters("Test-Case_Name"); // "TestCaseName"
```

### `removeNewLinesFromString()`

Replace newlines and extra whitespace with single space.

```ts
removeNewLinesFromString(str: string): string

removeNewLinesFromString("Line 1\nLine 2\nLine 3"); // "Line 1 Line 2 Line 3"
```

### `removeSpecialCharactersAndReplaceSpaceWithHyphen()`

Create URL-friendly slugs.

```ts
removeSpecialCharactersAndReplaceSpaceWithHyphen(str: string): string

removeSpecialCharactersAndReplaceSpaceWithHyphen("My Great Story"); // "my-great-story"
removeSpecialCharactersAndReplaceSpaceWithHyphen("Hello@World Title"); // "hello-world-title"
```

### `longestString()`

Find longest string in array.

```ts
longestString(strings: string[]): string

longestString(["a", "abc", "ab"]); // "abc"
longestString(["test"]); // "test"
```

---

## File Utilities

Located in `src/lib/common-library/utils/functions/`

### `fileToArrayBuffer()`

Convert File object to ArrayBuffer for upload to SharePoint.

```ts
fileToArrayBuffer(file: File): Promise&lt;ArrayBuffer&gt;

const file = fileInput.files[0];
const buffer = await fileToArrayBuffer(file);
// Now use buffer for SharePoint REST API upload
```

### `dataUriToFile()`

Convert base64 data URI to File object.

```ts
dataUriToFile(dataUri: string, filename: string): File

// After cropping image
const croppedDataUri = canvas.toDataURL("image/jpeg");
const croppedFile = dataUriToFile(croppedDataUri, "cropped.jpg");
// Use croppedFile for upload
```

---

## Temporal Utilities

Located in `src/lib/common-library/utils/functions/`

### `formatDate()`

Format ISO date string with i18n support.

```ts
formatDate(isoString: string, format: "short" | "long"): string

formatDate("2025-01-06T14:30:00Z", "short"); // "1/6/2025"
formatDate("2025-01-06T14:30:00Z", "long"); // "January 6, 2025"
```

### `getHoursMinutesFromMilliSeconds()`

Convert milliseconds to readable time.

```ts
getHoursMinutesFromMilliSeconds(ms: number): string

getHoursMinutesFromMilliSeconds(3661000); // "1h 1m"
getHoursMinutesFromMilliSeconds(60000); // "1m"
getHoursMinutesFromMilliSeconds(5000); // "5s"
```

---

## Object Utilities

Located in `src/lib/common-library/utils/functions/`

### `getObjectKeys()`

Type-safe Object.keys() - returns properly typed keys array.

```ts
getObjectKeys&lt;T&gt;(obj: T): (keyof T)[]

const user = { name: "John", age: 30 };
const keys = getObjectKeys(user); // ["name", "age"]
// keys is properly typed as ("name" | "age")[]
```

### `getObjectEntries()`

Type-safe Object.entries() - returns properly typed entries array.

```ts
getObjectEntries&lt;T&gt;(obj: T): [keyof T, T[keyof T]][]

const user = { name: "John", age: 30 };
const entries = getObjectEntries(user); // [["name", "John"], ["age", 30]]
// entries properly typed
```

---

## Number Utilities

Located in `src/lib/common-library/utils/functions/`

### `percentage()`

Calculate percentage of partial value out of total.

```ts
percentage(partial: number, total: number): number

percentage(25, 100); // 25
percentage(1, 3); // 33.33...
```

---

## Functional Utilities

Located in `src/lib/common-library/utils/functions/`

### `debounce()`

Debounce function execution - useful for search, resize events.

```ts
debounce&lt;T extends (...args: any[]) =&gt; any&gt;(fn: T, delay: number): (...args: Parameters&lt;T&gt;) =&gt; void

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// Called multiple times, but only executes once after 300ms silence
input.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});
```

### `convertToState()`

Convert plain object to Svelte reactive state.

```ts
convertToState&lt;T extends Record&lt;string, any&gt;&gt;(obj: T): T

const plainData = { count: 0, name: "John" };
const stateData = convertToState(plainData);

stateData.count++; // Reactive!
```

---

## CSS & Styling Utilities

### `cn()`

Merge Tailwind classes, handles conflicts via tailwind-merge.

```ts
cn(...inputs: ClassValue[]): string

import { cn } from "$lib/utils";

cn(
  "px-2 py-1 bg-red-500",
  condition && "bg-blue-500", // blue wins
  "text-white"
); // "px-2 py-1 bg-blue-500 text-white"
```

### Type Utilities

Located in `src/lib/utils.ts`

```ts
// Remove children prop from type
type WithoutChildren&lt;T&gt; = T extends { children?: any } ? Omit&lt;T, "children"&gt; : T;

// Add element ref to component props
type WithElementRef&lt;T, U extends HTMLElement = HTMLElement&gt; = T & {
  ref?: U | null;
};
```

---

## SharePoint Helper Utilities

Located in `src/lib/common-library/integrations/sharepoint-rest-api/helpers/`

### `getUserFirstLastNames()`

Parse SharePoint user properties to extract first and last names.

```ts
getUserFirstLastNames(userProps: Sharepoint_User_Properties): { first: string; last: string }

import { getUserFirstLastNames } from "$lib/common-library/integrations/sharepoint-rest-api/helpers";

const names = getUserFirstLastNames(currentUserProps);
console.log(names.first); // "John"
console.log(names.last); // "Doe"
```

### `getPictureUrl()`

Get user profile picture URL from SharePoint user properties.

```ts
getPictureUrl(userProps: Sharepoint_User_Properties): string | undefined

const picUrl = getPictureUrl(userProps);
// Use in &lt;img src={picUrl} /&gt;
```

### `createSelectExpandQueries()`

Build OData $select and $expand query parameters.

```ts
createSelectExpandQueries(select?: string[], expand?: string[]): string

const query = createSelectExpandQueries(
  ["Id", "Title", "Author/Id"],
  ["Author"]
);
// → "?$select=Id,Title,Author/Id&$expand=Author"

// Use with getListItems
const response = await getListItems({
  listName: "Stories",
  operations: [["select", "Id,Title"]],
  ...
});
```

### `poll()`

Polling utility with retry logic. Returns stop function.

```ts
poll(callback: () => Promise&lt;void&gt;, interval: number): () => void

import { poll } from "$lib/common-library/integrations/sharepoint-rest-api/helpers/poll";

const stopPolling = poll(async () => {
  const stories = await getStories();
  console.log(stories);
}, 2000); // Poll every 2 seconds

// Stop polling
stopPolling();
```

---

## Best Practices

✅ **DO:**

- Use type utilities to prevent prop-related bugs
- Use debounce for search/filter inputs
- Use formatDate for consistent date display
- Import from "$lib/utils" for cn() function

❌ **DON'T:**

- Use String.split() for complex parsing
- Forget to convert Files before upload
- Manually type Object.keys() - use getObjectKeys()
- Hardcode date formats - use formatDate()

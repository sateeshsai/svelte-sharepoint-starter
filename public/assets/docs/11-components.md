---
id: components
label: Components
description: UI library, forms, charts, rich text editor, carousels
keywords:
  - component
  - ui
  - button
  - form
  - input
  - chart
  - carousel
  - bits
---

# Components & UI

Comprehensive component library and styling setup.

**See also:** [Examples](/docs/examples) (components in real pages) | [Utilities](/docs/utils) (styling helpers)

---

## Component Library

Located in `src/lib/common-library/components/ui/`

### Carousel

Image/content carousel with Embla. Useful for image galleries and testimonials.

```svelte
<script>
  import Carousel from "$lib/common-library/components/ui/carousel/Carousel.svelte";
  import { p } from "sv-router/generated";
</script>

<Carousel items={stories} let:item>
  <a href={p("/stories/:id", { params: { id: item.Id } })}>
    <img src={`./assets/StoryFiles/${item.CoverFileName}`} alt={item.Title} />
    <h3>{item.Title}</h3>
  </a>
</Carousel>
```

**Used in:** Home page (`src/routes/index.svelte`)

### Rich Text Editor

Tiptap-based WYSIWYG editor with Markdown support, code blocks, tables, math, and image insertion.

```svelte
<script>
  import RichTextEditor from "$lib/common-library/components/RichTextEditor.svelte";
  import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";

  let content = $state("");
  const submitState = new AsyncSubmitState();
</script>

<RichTextEditor bind:content disabled={submitState.inProgress} />
```

**Features:**

- Markdown import/export
- Code blocks with syntax highlighting
- Tables and lists
- KaTeX math support
- Image insertion
- Bubble menu for formatting

**Used in:** Story creation (`src/routes/stories/[id]/index.svelte`)

### Edra Rich Text Editor (Enterprise)

Full-featured Tiptap editor with Markdown support, code blocks, tables, math, media insertion, and drag-handle controls. Includes built-in image/audio/video placeholder components with SharePoint file upload integration.

#### EdraEditor with File Upload Configuration

The `EdraEditor` component requires `sharepointFileUploadOptions` to be passed from the app layer. This decouples the editor from app-specific configuration:

```svelte
<script>
  import { EdraEditor, EdraToolBar, EdraDragHandleExtended } from "$lib/common-library/integrations/components/rich-text/edra-rich-text/shadcn";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import type { Content, Editor } from "@tiptap/core";

  let content = $state<Content>("");
  let editor = $state<Editor>();

  function onUpdate() {
    content = editor?.getHTML() as string;
  }
</script>

<div class="rounded-md border">
  {#if editor && !editor.isDestroyed}
    <EdraToolBar {editor} />
  {/if}
  <EdraEditor
    bind:editor
    {content}
    {onUpdate}
    sharepointFileUploadOptions={{
      siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
      serverRelativeUrl: SHAREPOINT_CONFIG.folders.StoryFiles.rel_path,
      folderName: SHAREPOINT_CONFIG.folders.StoryFiles.name,
    }}
  />
</div>
```

**Why pass as prop?**

The placeholder components (ImagePlaceholder, AudioPlaceholder, VideoPlaceholder) are reusable library components that don't import `SHAREPOINT_CONFIG` directly. Instead, they receive file upload options via context from the editor. This maintains clean separation:

- **App layer responsibility:** Provide configuration (knows about SHAREPOINT_CONFIG)
- **Library responsibility:** Handle file uploads (knows nothing about app-specific paths)

**FileUploadOptions interface:**

```typescript
interface FileUploadOptions {
  siteCollectionUrl: string; // e.g., "/sites/MyTeamSite"
  serverRelativeUrl: string; // e.g., "/sites/MyTeamSite/Shared Documents/StoryFiles"
  folderName: string; // e.g., "StoryFiles"
}
```

**Features:**

- Image, audio, video placeholder drag-and-drop upload
- Markdown import/export
- Code blocks with syntax highlighting
- Tables, lists, and KaTeX math support
- Drag handle for block manipulation
- LOCAL_MODE support (simulates file uploads without network calls)
- Error reporting to SharePoint via `reportError()`

**Used in:** Story editing (`src/routes/stories/[id]/edit/`)

### File Upload Components

#### FileDropZoneWrapper

Drag-and-drop file upload with validation.

```svelte
<script>
  import FileDropZoneWrapper from "$lib/common-library/components/media/FileDropZoneWrapper.svelte";
  import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";

  const fileUploadState = new AsyncSubmitState();
</script>

<FileDropZoneWrapper
  accept="image/*"
  {fileUploadState}
  onFilesDrop={async (files) => {
    fileUploadState.setInprogress();
    await uploadFiles(files);
    fileUploadState.setSuccess();
  }}
/>
```

#### Image Placeholder

Drag-and-drop image upload with cropper.

```svelte
<script>
  import ImagePlaceholder from "$lib/common-library/components/rich-text/edra-rich-text-extended/shadcn/components/ImagePlaceholder.svelte";

  const imageUploadState = new AsyncSubmitState();
</script>

<ImagePlaceholder {imageUploadState} onImageUpload={handleImageUpload} />
```

### Cropper

Image cropping component.

```svelte
<script>
  import CropperJsWrapper from "$lib/common-library/components/media/CropperJsWrapper.svelte";

  const cropState = new AsyncSubmitState();
</script>

<CropperJsWrapper
  imageSrc={selectedImage}
  {cropState}
  onCropComplete={async (croppedFile) => {
    await uploadCroppedImage(croppedFile);
  }}
/>
```

### Filters

Data filtering UI components for lists.

```svelte
<script>
  import ToggleFilters, { type Filter } from "$lib/common-library/components/filters/ToggleFilters.svelte";

  let filter: Filter = $state({
    category: "Tags",
    options: ["Frontend", "Backend", "Design"],
    selected: [],
  });
</script>

<ToggleFilters bind:filter />
```

**Used in:** Stories page (`src/routes/stories/index.svelte`)

### Form Components

Form handling with Superforms and Zod validation.

```svelte
<script>
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { storySchema } from "$lib/data/schemas";

  export let data;
  const { form, enhance } = superForm(data.form, {
    validators: zodClient(storySchema),
  });
</script>

<form method="POST" use:enhance>
  <input name="title" bind:value={$form.title} />
  <textarea name="content" bind:value={$form.content}></textarea>
  <button>Submit</button>
</form>
```

### UI Utility Components

#### ErrorBoundaryMessage

Display error messages with reset button.

```svelte
<svelte:boundary>
  {#snippet failed(error, reset)}
    <ErrorBoundaryMessage
      customError="Failed to load stories"
      {error}
      {reset}
    />
  {/snippet}

  <StoryList />
</svelte:boundary>
```

#### StatusMessage

Display status messages (loading, success, error, message). Pass `errorDetails` from AsyncLoadState to enable the "More Info" dialog with error reporting.

```svelte
<StatusMessage type="loading" message="Loading stories..." />
<StatusMessage type="success" message="Story saved successfully!" />
<StatusMessage type="error" message={loadState.error} errorDetails={loadState.errorDetails} />
```

#### ErrorReportDialog

Shared dialog component used by StatusMessage and ErrorBoundaryMessage for displaying error details, copying to clipboard, and sending email reports.

#### Breadcrumb Navigation

```svelte
<script>
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import { p } from "sv-router/generated";
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href={p("/")}>Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href={p("/stories")}>Stories</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>{storyTitle}</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

---

## Bits UI Components

Pre-built accessible components in `src/lib/components/ui/`

### Common Components

```svelte
<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/card.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Sidebar from "$lib/components/ui/sidebar/sidebar.svelte";
  import Sheet from "$lib/components/ui/sheet/sheet.svelte";
  import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import Accordion from "$lib/components/ui/accordion/accordion.svelte";
</script>

<Button variant="default" size="lg">Click me</Button>
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
<Badge variant="secondary">Tag</Badge>
```

### Admin Sidebar

```svelte
<script>
  import * as Sidebar from "$lib/components/ui/sidebar";
  import AppSidebar from "$lib/routes/admin/_components/AppSidebar.svelte";
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <!-- Page content -->
  </Sidebar.Inset>
</Sidebar.Provider>
```

**Used in:** Admin dashboard (`src/routes/admin/layout.svelte`)

---

## Charts

LayerChart-based visualizations in `src/routes/admin/_components/_charts/`

```svelte
<script>
  import AreaChart from "$lib/routes/admin/_components/_charts/AreaChart.svelte";
  import BarChart from "$lib/routes/admin/_components/_charts/BarChart.svelte";
  import LineChart from "$lib/routes/admin/_components/_charts/LineChart.svelte";
  import DonutChart from "$lib/routes/admin/_components/_charts/DonutChart.svelte";
</script>

<div class="grid grid-cols-3 gap-4">
  <AreaChart />
  <BarChart />
  <LineChart />
</div>
<DonutChart />
```

**Used in:** Admin dashboard (`src/routes/admin/index.svelte`)

---

## Styling

### Tailwind CSS 4

Full Tailwind setup with plugins:

- `@tailwindcss/forms` - Form styling
- `@tailwindcss/typography` - Prose classes for markdown

```svelte
<div class="prose-sm sm:prose mx-auto dark:prose-invert">
  <!-- Markdown content auto-styled -->
</div>
```

### Dark Mode

Automatic dark mode support via `mode-watcher`.

```svelte
<script>
  import { mode } from "mode-watcher";
</script>

{#if $mode === "dark"}
  <p>Dark mode active</p>
{/if}
```

### Custom Gradients

Custom gradient definitions in `src/lib/common-library/utils/css/gradients.css`

```css
.gradient-hero {
  @apply bg-gradient-to-br from-dblue-500 via-dblue-300 to-transparent;
}
```

### Utility Classes

Layout utility classes in `src/lib/common-library/utils/styling/classes.ts`:

```ts
// Section layout utilities
export const SECTION_CLASSES = {
  maxWidth: {
    narrow: "max-w-4xl justify-self-center w-full", // 56rem - reading/forms
    standard: "max-w-7xl justify-self-center w-full", // 80rem - default
    wide: "max-w-screen-xl justify-self-center w-full",
    full: "w-full",
  },
  appShell: "max-w-screen-4xl mx-auto", // Outermost container
  padding: {
    compact: "px-4 py-8 md:px-6 lg:py-10",
    standard: "px-6 py-14 lg:py-16 md:px-8",
    horizontal: "px-6 md:px-8",
  },
  gap: { sm: "gap-4", md: "gap-6 lg:gap-8", lg: "gap-8 lg:gap-12" },
};

// Prose/typography utilities (used by Prose component)
export const PROSE_CLASSES = {
  standard: "prose-sm sm:prose mx-auto dark:prose-invert",
  withLinks: "prose-sm sm:prose mx-auto dark:prose-invert prose-a:underline...",
};

// Heading styles
export const HEADING_CLASSES = {
  hero: "text-5xl xl:text-6xl font-thin tracking-tight",
  page: "text-3xl font-light",
  section: "text-xl font-semibold",
  subsection: "font-medium text-sm",
};
```

**Using constants directly:**

```svelte
<script>
  import { SECTION_CLASSES, HEADING_CLASSES, PROSE_CLASSES } from "$lib/common-library/utils";
  import { cn } from "$lib/utils";
</script>

<section class={cn(SECTION_CLASSES.padding.standard, SECTION_CLASSES.maxWidth.standard)}>
  <h1 class={HEADING_CLASSES.page}>Page Title</h1>
</section>
```

**Using Section component:**

```svelte
<script>
  import { Section, SectionHeader, Prose } from "$lib/common-library/components/layout";
</script>

<Section maxWidth="standard" padding="standard">
  <SectionHeader variant="page">Page Title</SectionHeader>
  <!-- Content -->
</Section>

<!-- Full-bleed background with constrained content -->
<Section fullBleedBg background="bg-muted/80 dark:bg-muted/30">
  <h2>Content here is max-w-7xl, background is full-width</h2>
</Section>

<!-- Prose for markdown/rich text content -->
<Section>
  <Prose variant="withLinks">
    {@html markdownContent}
  </Prose>
</Section>
```

**SectionHeader with breadcrumbs and actions:**

```svelte
<SectionHeader
  variant="page"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Stories" }
  ]}
>
  {#snippet actions()}
    <Button>Add New</Button>
  {/snippet}
  {#snippet intro()}
    <p>Browse all stories below.</p>
  {/snippet}
  All Stories
</SectionHeader>
```

---

## Best Practices

✅ **DO:**

- Wrap components in `<svelte:boundary>` for error handling
- Use StatusMessage for feedback
- Use AsyncLoadState/AsyncSubmitState for loading states
- Use type-safe routing with `p()` function
- Use cn() to merge Tailwind classes

❌ **DON'T:**

- Mix hardcoded href with router
- Forget error boundaries on complex pages
- Use inline styles instead of Tailwind
- Create custom components when Bits UI exists
- Ignore loading states in async operations

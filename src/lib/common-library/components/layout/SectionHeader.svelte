<!--
  @component SectionHeader
  Flexible header component for sections with optional breadcrumbs, actions, badge, and intro.
  Renders semantic heading elements with consistent typography.

  @example Basic usage
  ```svelte
  <SectionHeader variant="page">Stories</SectionHeader>
  ```

  @example With breadcrumbs prop (array)
  ```svelte
  <SectionHeader
    variant="page"
    breadcrumbs={[
      { label: "Home", href: "#/" },
      { label: "Stories" }
    ]}
  >
    All Stories
  </SectionHeader>
  ```

  @example With actions and intro slots
  ```svelte
  <SectionHeader variant="page">
    {#snippet actions()}
      <Button>Add New</Button>
    {/snippet}
    {#snippet intro()}
      <p>Browse all available stories below.</p>
    {/snippet}
    Stories
  </SectionHeader>
  ```

  @example With breadcrumbs slot (custom rendering)
  ```svelte
  <SectionHeader variant="section">
    {#snippet breadcrumbs()}
      <a href="#/stories">← Back to Stories</a>
    {/snippet}
    Story Title
  </SectionHeader>
  ```
-->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { HEADING_CLASSES, HEADING_LEVEL_MAP, type HeadingVariant } from "$lib/common-library/utils";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type BreadcrumbItem = {
    label: string;
    href?: string;
  };

  type Props = HTMLAttributes<HTMLElement> & {
    /** Typography variant. Determines default heading level and styles */
    variant?: HeadingVariant;
    /** Override the heading element (h1-h6). Inferred from variant if not set */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /** Breadcrumb items. Last item is treated as current page (no link). Ignored if breadcrumbs slot is used */
    breadcrumbs?: BreadcrumbItem[];
    /** Additional classes for the heading element */
    class?: string;
    /** Additional classes for the header wrapper */
    wrapperClass?: string;
    /** Heading text content */
    children?: Snippet;
    /** Custom breadcrumb rendering (overrides breadcrumbs prop) */
    breadcrumbsSnippet?: Snippet;
    /** Content to show next to heading (tags, badges, status) */
    badge?: Snippet;
    /** Actions on the right side (buttons, filters) */
    actions?: Snippet;
    /** Intro/description paragraph below the header row */
    intro?: Snippet;
  };

  let { variant = "page", as, breadcrumbs = [], class: className = "", wrapperClass = "", children, breadcrumbsSnippet, badge, actions, intro, ...restProps }: Props = $props();

  // Infer heading level from variant if not explicitly set
  const HeadingElement = $derived(as ?? HEADING_LEVEL_MAP[variant]);

  const headingClasses = $derived(cn(HEADING_CLASSES[variant], className));

  // Check if we have any breadcrumbs to render (prop or slot)
  const hasBreadcrumbs = $derived(breadcrumbsSnippet !== undefined || breadcrumbs.length > 0);
</script>

<header class={cn("sectionHeader", wrapperClass)} {...restProps}>
  <!-- Breadcrumbs row -->
  {#if hasBreadcrumbs}
    <nav class="breadcrumbs mb-2">
      {#if breadcrumbsSnippet}
        {@render breadcrumbsSnippet()}
      {:else if breadcrumbs.length > 0}
        <Breadcrumb.Root>
          <Breadcrumb.List class="p-0">
            {#each breadcrumbs as item, idx}
              {#if idx > 0}
                <Breadcrumb.Separator />
              {/if}
              <Breadcrumb.Item class={idx === 0 ? "pl-0" : ""}>
                {#if item.href && idx < breadcrumbs.length - 1}
                  <Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
                {:else}
                  <Breadcrumb.Page>{item.label}</Breadcrumb.Page>
                {/if}
              </Breadcrumb.Item>
            {/each}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      {/if}
    </nav>
  {/if}

  <!-- Title row: heading + badge | actions -->
  <div class={cn("titleRow flex items-center gap-4", actions ? "justify-between" : "", intro ? "mb-2" : "mb-6 lg:mb-10")}>
    <div class="headingGroup flex items-center gap-3">
      <svelte:element this={HeadingElement} class={headingClasses}>
        {#if children}
          {@render children()}
        {/if}
      </svelte:element>
      {#if badge}
        <div class="badge">
          {@render badge()}
        </div>
      {/if}
    </div>
    {#if actions}
      <div class="actions">
        {@render actions()}
      </div>
    {/if}
  </div>

  <!-- Intro row -->
  {#if intro}
    <div class="intro mb-6 lg:mb-8">
      {@render intro()}
    </div>
  {/if}
</header>

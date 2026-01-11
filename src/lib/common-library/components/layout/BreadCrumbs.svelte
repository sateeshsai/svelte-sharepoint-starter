<script lang="ts" module>
  export type BreadcrumbItem = {
    label: string;
    href?: string;
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  type Props = {
    /** Breadcrumb items. Last item is treated as current page (no link). Ignored if breadcrumbsSnippet is used */
    breadcrumbs?: BreadcrumbItem[];
    /** Custom breadcrumb rendering (overrides breadcrumbs prop) */
    breadcrumbsSnippet?: Snippet;
  };

  const { breadcrumbsSnippet, breadcrumbs = [] }: Props = $props();

  const hasBreadcrumbs = $derived(breadcrumbsSnippet !== undefined || breadcrumbs.length > 0);
</script>

{#if hasBreadcrumbs}
  <nav class="breadcrumbs mb-2">
    {#if breadcrumbsSnippet}
      {@render breadcrumbsSnippet()}
    {:else}
      <Breadcrumb.Root>
        <Breadcrumb.List class="not-prose">
          {#each breadcrumbs as item, idx}
            {#if idx > 0}
              <Breadcrumb.Separator />
            {/if}
            <Breadcrumb.Item class={idx === 0 ? "pl-0!" : ""}>
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

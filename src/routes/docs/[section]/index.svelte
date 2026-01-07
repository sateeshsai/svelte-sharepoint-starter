<script lang="ts">
  import { getContext } from "svelte";
  import { cn } from "$lib/utils";
  import { p, route } from "sv-router/generated";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import { SharePointAsyncLoadState } from "$lib/common-library/integrations/error-handling";

  import { renderDocSection, type DocSection } from "../get.svelte";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";

  const params = $derived(route.getParams("/docs/:section"));
  const sectionSlug = $derived(params.section);

  // Get sections from layout context
  const getDocSections = getContext<() => DocSection[]>("getDocSections") || (() => []);

  let htmlContent = $state("");
  const loadState = new SharePointAsyncLoadState();

  // Get current section and load its HTML content
  const sections = $derived(getDocSections());
  const sectionData = $derived(sections.find((s) => s.id === sectionSlug));

  $effect(() => {
    loadData();
  });

  async function loadData() {
    if (sectionData) {
      htmlContent = (await renderDocSection(sectionData, loadState)) || "";
    }
  }
</script>

<main class={cn(PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth, "max-w-fit")}>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering documentation." {error} {reset} />
    {/snippet}
    {#if loadState.loading}
      <div class={cn("p-8")}>
        <StatusMessage type="loading" message="Loading documentation..." />
      </div>
    {:else if loadState.error}
      <div class={cn("p-8")}>
        <StatusMessage type="error" message={loadState.error || "Failed to load documentation"} />
      </div>
    {:else if loadState.ready && sectionData && htmlContent}
      <div class={cn("p-8")}>
        <Breadcrumb.Root>
          <Breadcrumb.List class="p-0">
            <Breadcrumb.Item class="pl-0">
              <Breadcrumb.Link href={p("/docs")}>Documentation</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>{sectionData.label}</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <section class="docHTML prose-sm sm:prose mx-auto dark:prose-invert">
          {@html htmlContent}
        </section>
      </div>
    {:else}
      <div class={cn("p-8")}>
        <StatusMessage type="error" message={`Documentation section not found: ${sectionSlug}`} />
      </div>
    {/if}
  </svelte:boundary>
</main>

<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/integrations/error-handling";

  import { renderDocSection, type DocSection } from "$lib/data/items/docs";
  import { getContext } from "svelte";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";

  let htmlContent = $state("");
  const loadState = new AsyncLoadState();
  // Get sections from layout context
  const getDocSections = getContext<() => DocSection[]>("getDocSections") || (() => []);

  $effect(() => {
    loadData();
  });

  async function loadData() {
    const sections = getDocSections();
    // Find the overview section (first one)
    const section = sections[0];
    if (section) {
      htmlContent = (await renderDocSection(section, loadState)) || "";
    }
  }
</script>

<main>
  <Breadcrumb.Root>
    <Breadcrumb.List class="p-0">
      <Breadcrumb.Item class="pl-0">
        <Breadcrumb.Page>Documentation</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <div class="prose-sm sm:prose mx-auto dark:prose-invert mt-8">
    <svelte:boundary>
      {#snippet failed(error: any, reset)}
        <ErrorBoundaryMessage customError="Error rendering documentation." {error} {reset} />
      {/snippet}

      {#if loadState.loading}
        <StatusMessage type="loading" message="Loading documentation..." />
      {:else if loadState.error}
        <StatusMessage type="error" message={loadState.error} errorDetails={loadState.errorDetails} />
      {:else if loadState.ready}
        {@html htmlContent}
      {/if}
    </svelte:boundary>
  </div>
</main>

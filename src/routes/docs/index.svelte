<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import { SharePointAsyncLoadState } from "$lib/common-library/integrations/error-handling";

  import { renderDocSection, type DocSection } from "./get.svelte";
  import { getContext } from "svelte";

  let htmlContent = $state("");
  const loadState = new SharePointAsyncLoadState();
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

<div class={cn("p-8")}>
  <Breadcrumb.Root>
    <Breadcrumb.List class="p-0">
      <Breadcrumb.Item class="pl-0">
        <Breadcrumb.Page>Documentation</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <div class="prose-sm sm:prose mx-auto dark:prose-invert max-w-4xl mt-8">
    <svelte:boundary>
      {#snippet failed(error: any, reset)}
        <ErrorBoundaryMessage customError="Error rendering documentation." {error} {reset} />
      {/snippet}

      {#if loadState.loading}
        <StatusMessage type="loading" message="Loading documentation..." />
      {:else if loadState.error}
        <StatusMessage type="error" message={loadState.error} />
      {:else if loadState.ready}
        {@html htmlContent}
      {/if}
    </svelte:boundary>
  </div>
</div>

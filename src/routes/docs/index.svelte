<script lang="ts">
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/integrations/error-handling";

  import { renderDocSection, type DocSection } from "$lib/data/items/docs";
  import { getContext } from "svelte";
  import { SectionHeader, Prose } from "$lib/common-library/components/layout";

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
  <SectionHeader variant="subsection" breadcrumbs={[{ label: "Documentation" }]}></SectionHeader>

  <Prose class="mt-8">
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
  </Prose>
</main>

<script lang="ts">
  import { getContext } from "svelte";
  import { p, route } from "sv-router/generated";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/integrations/error-handling";

  import { renderDocSection, type DocSection } from "$lib/data/items/docs";
  import { Section, SectionHeader } from "$lib/common-library/components/layout";
  import { SECTION_CLASSES } from "$lib/common-library/utils";

  const params = $derived(route.getParams("/docs/:section"));
  const sectionSlug = $derived(params.section);

  // Get sections from layout context
  const getDocSections = getContext<() => DocSection[]>("getDocSections") || (() => []);

  let htmlContent = $state("");
  const loadState = new AsyncLoadState();

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

<Section as="main" maxWidth="narrow" padding="compact" class="max-w-fit">
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering documentation." {error} {reset} />
    {/snippet}
    {#if loadState.loading}
      <div class="p-8">
        <StatusMessage type="loading" message="Loading documentation..." />
      </div>
    {:else if loadState.error}
      <div class="p-8">
        <StatusMessage type="error" message={loadState.error || "Failed to load documentation"} errorDetails={loadState.errorDetails} />
      </div>
    {:else if loadState.ready && sectionData && htmlContent}
      <div class="p-8">
        <SectionHeader variant="subsection" breadcrumbs={[{ label: "Documentation", href: p("/docs") }, { label: sectionData.label }]}></SectionHeader>

        <section class={SECTION_CLASSES.prose.standard}>
          {@html htmlContent}
        </section>
      </div>
    {:else}
      <div class="p-8">
        <StatusMessage type="error" message={`Documentation section not found: ${sectionSlug}`} />
      </div>
    {/if}
  </svelte:boundary>
</Section>

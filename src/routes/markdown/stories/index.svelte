<script lang="ts">
  import { onMount } from "svelte";
  import ListFilter from "@lucide/svelte/icons/list-filter";
  import { getMarkdownStories, type StoryMarkdown } from "$lib/data/items/stories-markdown";
  import type { Filter } from "$routes/stories/_components/StoryFilters.svelte";
  import { AsyncLoadState, apiError } from "$lib/common-library/integrations/error-handling";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import StoryFilters from "$routes/stories/_components/StoryFilters.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { fly } from "svelte/transition";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import MarkdownStories from "./_components/MarkdownStories.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { Section, SectionHeader } from "$lib/common-library/components/layout";
  let storiesLoadState = new AsyncLoadState();
  let stories: StoryMarkdown[] = $state([]);

  onMount(async () => {
    storiesLoadState.setLoading();
    try {
      stories = await getMarkdownStories();
      storiesLoadState.setReady();
    } catch (error) {
      storiesLoadState.setError(apiError({ userMessage: "Failed to load stories", technicalMessage: error instanceof Error ? error.message : String(error), context: "MarkdownStoriesPage" }));
    }
  });

  let storiesToShow = $derived(
    stories?.filter((story) => {
      const tagsFilterValidate =
        !filters.Tags.selected.length || filters.Tags.selected.reduce((acc, selectedTag) => (story.Tags.toLowerCase().includes(selectedTag.toLowerCase()) ? true : acc), false);
      const yearFilterValidate = !filters.Year.selected.length || filters.Year.selected.reduce((acc, selectedYear) => (new Date(story.Created).getFullYear() === +selectedYear ? true : acc), false);

      return tagsFilterValidate && yearFilterValidate;
    })
  );

  const filters: Record<"Tags" | "Year", Filter> = $derived.by(() => {
    const _filters = $state({
      Tags: {
        category: "Tags",
        options: [...new Set(stories?.map((s) => s.Tags?.replaceAll(" ", "").split(",")).flat())],
        selected: [],
        description: "Stories tagged with the selected keywords",
      },
      Year: {
        category: "Year",
        options: [...new Set(stories?.map((s) => s.Modified).map((d) => new Date(d).getFullYear().toString()))],
        selected: [],
        description: "Stories published in the selected years",
      },
    });
    return _filters;
  });

  const filtersArray = $derived.by(() => {
    const _filtersArray = $state(Object.values(filters));
    return _filtersArray;
  });

  trackAnalytics();
</script>

<Section as="main">
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering stories page (from Markdown)." {error} {reset} />
    {/snippet}
    <section class="stories h-full min-h-[50dvh]">
      {#if storiesLoadState.loading}
        <StatusMessage type="loading" message="Loading stories" />
      {:else if storiesLoadState.ready && stories}
        <div in:fly={{ y: -10 }}>
          <SectionHeader variant="page">
            {#snippet actions()}
              <Sheet.Root>
                <Sheet.Trigger class="border p-1 aspect-square rounded">
                  <ListFilter size={20} class="text-muted-foreground" />
                </Sheet.Trigger>
                <Sheet.Content class="z-100">
                  <Sheet.Header>
                    <Sheet.Title class="text-lg">Filters</Sheet.Title>
                    <Sheet.Description>Filter stories</Sheet.Description>
                  </Sheet.Header>
                  <div class="grid gap-6 px-4">
                    {#each filtersArray as filter, idx}
                      <div class="filterCategory">
                        <Label class="mb-1.5 text-base ">{filter.category}</Label>
                        <StoryFilters type="multiple" bind:filter={filtersArray[idx]} />
                      </div>
                    {/each}
                  </div>
                </Sheet.Content>
              </Sheet.Root>
            {/snippet}
            Markdown Stories
          </SectionHeader>
        </div>

        {#if storiesToShow}
          <MarkdownStories stories={storiesToShow} />
        {/if}
      {/if}

      {#if storiesLoadState.error}
        <StatusMessage type="error" message={storiesLoadState.error} errorDetails={storiesLoadState.errorDetails} />
      {/if}
    </section>
  </svelte:boundary>
</Section>

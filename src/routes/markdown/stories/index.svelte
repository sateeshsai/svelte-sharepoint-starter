<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import ListFilter from "@lucide/svelte/icons/list-filter";
  import type { StoryMarkdown } from "./get-stories";
  import type { Filter } from "$routes/stories/_components/StoryFilters.svelte";
  import { getStories } from "./get-stories";
  import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import StoryFilters from "$routes/stories/_components/StoryFilters.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { fly } from "svelte/transition";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import MarkdownStories from "./_components/MarkdownStories.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";
  let storiesLoadState = new AsyncLoadState();
  let stories: StoryMarkdown[] = $state([]);

  onMount(async () => {
    storiesLoadState.setLoading();
    try {
      stories = await getStories();
      storiesLoadState.setReady();
    } catch (error) {
      storiesLoadState.setError(error instanceof Error ? error.message : "Failed to load stories");
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

<main class={cn("grid", PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering stories page (from Markdown)." {error} {reset} />
    {/snippet}
    <section class="stories h-full min-h-[50dvh]">
      {#if storiesLoadState.loading}
        <StatusMessage type="loading" message="Loading stories" />
      {:else if storiesLoadState.ready && stories}
        <div class="titleHeader flex justify-between mb-10 items-center" in:fly={{ y: -10 }}>
          <h1 class="text-3xl font-light">Markdown Stories</h1>
          <div class="filters">
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
          </div>
        </div>

        {#if storiesToShow}
          <MarkdownStories stories={storiesToShow} />
        {/if}
      {/if}

      {#if storiesLoadState.error}
        <StatusMessage type="error" message={storiesLoadState.error} />
      {/if}
    </section>
  </svelte:boundary>
</main>

<script lang="ts">
  import ListFilter from "@lucide/svelte/icons/list-filter";
  import Stories from "./_components/Stories.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";

  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import type { Filter } from "./_components/StoryFilters.svelte";
  import StoryFilters from "./_components/StoryFilters.svelte";
  import { getStories } from "$lib/data/items/stories";
  import { AsyncLoadState, trackAnalytics, poll } from "$lib/common-library/integrations";
  import { getContext, onMount } from "svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { fly } from "svelte/transition";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

  const { signal } = useAbortController();

  let storiesLoadState = new AsyncLoadState();
  let stories: Story_ListItem[] | undefined = $state();

  let stopPolling: ReturnType<typeof poll>;

  onMount(() => {
    loadStories();
    return stopPolling;
  });

  async function loadStories() {
    let lastFetchTimeString: string | undefined;

    //Poll for new stories every n seconds (2s local, 10s SharePoint)
    const pollInterval = LOCAL_MODE ? 2000 : 10000;

    stopPolling = poll(async () => {
      // Capture timestamp BEFORE fetch to avoid missing items created during the fetch
      const currentFetchTimeString = new Date().toISOString();
      const storiesFromDB = await getStories(storiesLoadState, lastFetchTimeString, signal, false);
      console.log(storiesFromDB);

      // Stop polling only if fetch failed (storiesFromDB is undefined on error)
      // Empty arrays [] are valid responses and keep polling active
      if (storiesFromDB === undefined || storiesLoadState.error) {
        stopPolling();
        return;
      }

      // Update timestamp AFTER successful fetch, BEFORE adding to array
      // This ensures next poll gets items created after this timestamp
      lastFetchTimeString = currentFetchTimeString;
      stories = stories ? [...stories, ...storiesFromDB] : storiesFromDB;
    }, pollInterval);
  }

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
  <section class="stories h-full min-h-[50dvh]">
    <svelte:boundary>
      {#snippet failed(error: any, reset)}
        <ErrorBoundaryMessage customError="Error rendering stories page." {error} {reset} />
      {/snippet}

      {#if storiesLoadState.loading}
        <StatusMessage type="loading" message="Loading stories..." />
      {:else if storiesLoadState.ready && storiesToShow}
        <div class="titleHeader flex justify-between mb-10 items-center" in:fly={{ y: -10 }}>
          <h1 class="text-3xl font-light">Stories</h1>
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

        <Stories stories={storiesToShow} />
      {/if}

      {#if storiesLoadState.error}
        <StatusMessage type="error" message={storiesLoadState.error} />
      {/if}
    </svelte:boundary>
  </section>
</main>

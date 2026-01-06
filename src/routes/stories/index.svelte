<script lang="ts">
  import ListFilter from "@lucide/svelte/icons/list-filter";
  import Stories from "./_components/Stories.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";

  import type { Story_ListItem } from "$lib/data/types";
  import type { Filter } from "./_components/StoryFilters.svelte";
  import StoryFilters from "./_components/StoryFilters.svelte";
  import { getStories } from "./get.svelte";
  import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import { onMount } from "svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { fly } from "svelte/transition";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import { poll } from "$lib/common-library/integrations/sharepoint-rest-api/helpers/poll";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";

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

    //Poll for new stories every n seconds
    stopPolling = poll(async () => {
      const storiesFromDB = await getStories(storiesLoadState, lastFetchTimeString, signal);
      lastFetchTimeString = new Date().toISOString();
      console.log(storiesFromDB);

      // Stop polling if fetch failed or no data returned
      if (!storiesFromDB || storiesLoadState.error) {
        stopPolling();
        return;
      }

      stories = stories ? [...stories, ...storiesFromDB] : storiesFromDB;
    }, 2000);
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

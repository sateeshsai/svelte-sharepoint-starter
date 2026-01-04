<script lang="ts">
  import ListFilter from "@lucide/svelte/icons/list-filter";
  import Stories from "./_components/Stories.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/const/classes";

  import type { Story_ListItem } from "$lib/data/types";
  import type { Filter } from "./_components/StoryFilters.svelte";
  import StoryFilters from "./_components/StoryFilters.svelte";
  import { getStories } from "./get";
  import { AsyncLoadState } from "$lib/common-library/functions/async.svelte";
  import { onMount } from "svelte";
  import StatusMessage from "$lib/common-library/components/ui-utils/StatusMessage.svelte";
  import { fly } from "svelte/transition";
  import { trackAnalytics } from "$lib/common-library/analytics/analytics";
  import { getListItems } from "$lib/common-library/sharepoint-rest-api/get/getListItems";
  import { poll } from "$lib/common-library/sharepoint-rest-api/helpers/poll";

  let storiesLoadState = new AsyncLoadState<Story_ListItem[]>();
  let stories: Story_ListItem[] | undefined = $state();

  onMount(() => {
    loadStories();
  });

  async function loadStories() {
    const stopPolling = poll(async () => {
      const storiesFromDB = await getStories(storiesLoadState);
      if (!storiesFromDB) {
        stopPolling();
        return;
      }
      stories = storiesFromDB;
    }, 5000);
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
    {#if storiesLoadState.loading}
      <StatusMessage type="loading" message="Loading stories..." />
    {:else if stories}
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

      {#if storiesToShow}
        <Stories stories={storiesToShow} />
      {/if}
    {/if}

    {#if storiesLoadState.error}
      <p class="text-destructive">{storiesLoadState.error}</p>
    {/if}
  </section>
</main>

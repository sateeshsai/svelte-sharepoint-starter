<script lang="ts">
  import StoryEditor from "./_components/StoryEditor.svelte";
  import type { Story_ListItem } from "$lib/data/types";
  import { navigate } from "sv-router/generated";
  import { route } from "sv-router/generated";
  import { global_State } from "$lib/data/global-state.svelte";
  import { getStory } from "../get.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/utils/functions/async.svelte";
  import { onMount } from "svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import { slide } from "svelte/transition";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";

  const params = $derived(route.getParams("/stories/:id/edit"));
  const storyId = $derived(params.id === "new" ? undefined : params.id);

  let storyLoadState = new AsyncLoadState<Story_ListItem>();
  let story: Story_ListItem | undefined = $state();
  let userCanEdit = $derived(global_State.AccessRole === "Admin" || story?.Author.Id === global_State.user?.Id);

  onMount(() => {
    if (storyId) {
      loadData(storyId);
    }
  });

  async function loadData(story_Id: string | undefined) {
    if (!story_Id || Number.isNaN(+story_Id)) {
      navigate("/stories", {
        replace: true,
      });
      return;
    }

    story = await getStory(+story_Id, storyLoadState);

    if (story && !userCanEdit) {
      navigate("/stories/:id", {
        params: {
          id: String(story?.Id),
        },
        replace: true,
      });
    }
  }

  trackAnalytics();
</script>

<main>
  <article class={cn("stories h-full", PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
    {#if storyLoadState?.loading}
      <StatusMessage type="loading" message="Validating access..." />
    {:else if story && userCanEdit}
      <StoryEditor bind:story />
    {/if}

    {#if storyLoadState?.error}
      <StatusMessage type="error" message={storyLoadState.error} />
    {/if}
  </article>
</main>

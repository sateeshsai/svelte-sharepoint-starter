<script lang="ts">
  import StoryEditor from "./_components/StoryEditor.svelte";
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import { navigate } from "sv-router/generated";
  import { route } from "sv-router/generated";
  import { canEditItem } from "$lib/data/global-state.svelte";
  import { getStory } from "$lib/data/items/stories";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { AsyncLoadState } from "$lib/common-library/integrations/error-handling";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import { slide } from "svelte/transition";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";

  const { signal } = useAbortController();

  const params = $derived(route.getParams("/stories/:id/edit"));
  const storyId = $derived(params.id === "new" ? undefined : params.id);

  let storyLoadState = new AsyncLoadState();
  let story: Story_ListItem | undefined = $state();
  let currentUserCanEdit = $derived(canEditItem(story?.Author?.Id));

  // Use $effect instead of onMount to react to storyId changes during navigation
  $effect(() => {
    console.log("[edit/index.svelte] effect running, storyId=", storyId);
    if (storyId) {
      loadData(storyId);
    }
  });

  async function loadData(story_Id: string | undefined) {
    console.log("[edit/index.svelte] loadData called, story_Id=", story_Id);
    if (!story_Id || Number.isNaN(+story_Id)) {
      navigate("/stories", {
        replace: true,
      });
      return;
    }

    story = await getStory(+story_Id, storyLoadState, signal);
    console.log("[edit/index.svelte] story loaded=", story);

    if (story && !currentUserCanEdit) {
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
    <svelte:boundary>
      {#snippet failed(error: any, reset)}
        <ErrorBoundaryMessage customError="Error rendering story editor page." {error} {reset} />
      {/snippet}
      {#if storyLoadState?.loading}
        <StatusMessage type="loading" message="Validating access..." />
      {:else if story && currentUserCanEdit}
        <StoryEditor bind:story />
      {/if}

      {#if storyLoadState?.error}
        <StatusMessage type="error" message={storyLoadState.error} errorDetails={storyLoadState.errorDetails} />
      {/if}
    </svelte:boundary>
  </article>
</main>

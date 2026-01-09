<script lang="ts">
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import { flip } from "svelte/animate";
  import { crossfade, slide } from "svelte/transition";
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),
  });
  import { p } from "sv-router/generated";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { groupReactionsByEmoji, getComments, type Engagement_ListItem } from "$lib/common-library/integrations";
  import { getStoryEngagements } from "$lib/data/items/stories";
  import { AsyncLoadState } from "$lib/common-library/integrations";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";

  const { signal } = useAbortController();

  const { stories }: { stories: Story_ListItem[] } = $props();

  // Fetch engagements for all stories
  let allEngagements: Record<number, Engagement_ListItem[]> = $state({});

  async function loadAllEngagements() {
    const loadState = new AsyncLoadState();

    // Fetch engagements for each story using domain API
    for (const story of stories) {
      const engagements = await getStoryEngagements(story.Id, loadState, signal);
      if (engagements) {
        allEngagements[story.Id] = engagements;
      }
    }
  }

  $effect(() => {
    if (stories?.length) {
      loadAllEngagements();
    }
  });

  function getStoryEngagementSummary(storyId: number) {
    const engagements = allEngagements[storyId] || [];
    const reactions = groupReactionsByEmoji(engagements);
    const comments = getComments(engagements);
    return { reactions, commentCount: comments.length, totalReactions: reactions.reduce((sum, r) => sum + r.count, 0) };
  }
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering stories." {error} {reset} />
  {/snippet}
  <div class="stories grid gap-8 md:grid-cols-2 xl:grid-cols-3" in:slide|global>
    {#each [...stories].sort((a, b) => (new Date(a.Created) > new Date(b.Created) ? -1 : 1)) as story (story.Id)}
      {@const summary = getStoryEngagementSummary(story.Id)}
      <a
        class="storyItem @container rounded border dark:border-muted-foreground/50 p-3 shadow-lg grid h-full w-full grid-cols-[auto_1fr] items-center gap-4"
        href={p("/stories/:id", {
          params: {
            id: String(story.Id),
          },
        })}
        in:receive={{ key: story.Id, duration: 500 }}
        out:send={{ key: story.Id, duration: 500 }}
        animate:flip={{ duration: 500 }}
      >
        <div class="storyThumbnail rounded bg-center bg-cover h-36 w-36" style="background-image:{`url(${'./assets/StoryFiles/' + story.CoverFileName})`}"></div>
        <div class="storyInfo grid gap-2 content-start">
          <p class="font-bold line-clamp-2">{story.Title}</p>
          <p class="text-sm line-clamp-3">{story.Introduction}</p>

          <!-- Engagement Summary -->
          {#if summary.totalReactions > 0 || summary.commentCount > 0}
            <div class="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              {#if summary.totalReactions > 0}
                <div class="flex items-center gap-1">
                  {#each summary.reactions.slice(0, 3) as reaction}
                    <span class="text-sm">{reaction.emoji}</span>
                  {/each}
                  <span>{summary.totalReactions}</span>
                </div>
              {/if}
              {#if summary.commentCount > 0}
                <div class="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{summary.commentCount}</span>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>
</svelte:boundary>

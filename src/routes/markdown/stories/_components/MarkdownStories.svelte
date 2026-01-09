<script lang="ts">
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import { flip } from "svelte/animate";
  import { crossfade, slide } from "svelte/transition";
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),
  });
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { p } from "sv-router/generated";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";

  const { stories }: { stories: Story_ListItem[] } = $props();
</script>

<div class="stories grid gap-8 md:grid-cols-2 xl:grid-cols-3" in:slide|global>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering stories links (from Markdown)." {error} {reset} />
    {/snippet}
    {#each [...stories].sort((a, b) => (new Date(a.Created) > new Date(b.Created) ? -1 : 1)) as story (story.Id)}
      <a
        class="storyItem @container rounded border dark:border-muted-foreground/50 p-3 shadow-lg grid h-full w-full grid-cols-[auto_1fr] items-center gap-4"
        href={p("/markdown/stories/:storyname", {
          params: {
            storyname: String(story.Title),
          },
        })}
        in:receive={{ key: story.Id, duration: 500 }}
        out:send={{ key: story.Id, duration: 500 }}
        animate:flip={{ duration: 500 }}
      >
        <div class="storyThumbnail rounded bg-center bg-cover h-36 w-36" style="background-image:{`url(${'./assets/StoryFiles/' + story.CoverFileName})`}"></div>
        <div class="storyInfo grid gap-2 content-start">
          <p class="font-bold">{story.Title}</p>
          <p class="text-sm">{story.Introduction}</p>
        </div>
      </a>
    {/each}
  </svelte:boundary>
</div>

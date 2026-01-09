<script lang="ts">
  import { onMount } from "svelte";
  import { getStory } from "./get-story";
  import type { StoryMarkdown } from "../get-stories";
  import { route, p } from "sv-router/generated";
  import { cn } from "$lib/utils";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import { AsyncLoadState, notFoundError, validationError } from "$lib/common-library/integrations/error-handling";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import LineAnimated from "$lib/common-library/utils/components/ui-utils/Line_Animated.svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import { scale, fly } from "svelte/transition";
  import StoryFileGallery from "$routes/stories/[id]/_components/StoryFileGallery.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";

  let storyLoadState = new AsyncLoadState();
  let story: StoryMarkdown | null = $state(null);

  const params = $derived(route.getParams("/markdown/stories/:storyname"));
  const slug = $derived(params.storyname);

  onMount(async () => {
    storyLoadState.setLoading();

    if (!slug) {
      storyLoadState.setError(validationError({ userMessage: "No story selected", context: "StoryMarkdownPage" }));
      return;
    }

    story = await getStory(slug);
    if (!story) {
      storyLoadState.setError(notFoundError({ userMessage: `Story "${slug}" not found`, context: "StoryMarkdownPage" }));
    } else {
      storyLoadState.setReady();
    }
  });
</script>

<main class={cn("grid justify-center", PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering story page (from Markdown)." {error} {reset} />
    {/snippet}

    {#if storyLoadState?.loading}
      <StatusMessage type="loading" message="Loading story" />
    {:else if storyLoadState.ready && story}
      <article
        class="mdStoryContainer prose-sm prose-a:underline prose-a:decoration-muted-foreground prose-a:decoration-1 prose-a:underline-offset-3 max-w-5xl w-full dark:prose-invert text-pretty prose"
      >
        <Breadcrumb.Root>
          <Breadcrumb.Item>
            <Breadcrumb.Link class="p-0 flex gap-2 items-center no-underline!" href={p("/markdown/stories")}>
              <ArrowLeft size="24" class="bg-muted/50 border p-1 rounded" />
              Back to Stories
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.Root>

        <header class="storyHeader mt-4">
          <h1 class="mt-4 mb-4" in:fly={{ x: -50 }}>{story.Title}</h1>
          <div class="flex gap-2 items-baseline my-4">
            <p class="my-0!">{story.Author.Title}</p>
            |
            <time class="text-sm text-muted-foreground" datetime={new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
              >{new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</time
            >
          </div>
        </header>

        <img in:scale|global={{ start: 0 }} alt={story.Title} src={"./assets/StoryFiles/" + story.CoverFileName} class="rounded-md mt-2 max-h-75 w-full object-cover object-center" />

        <h3 class="">{story.Introduction}</h3>
        <LineAnimated class="mt-8 mb-6" />

        <div class="storyContent">
          {@html story.htmlContent}
        </div>

        {#if story.Files && story.Files.length > 0}
          <section class="mt-8">
            <StoryFileGallery folderPath="./assets/StoryFiles/" files={story.Files} />
          </section>
        {/if}
      </article>
    {:else if storyLoadState?.error}
      <StatusMessage type="error" message={storyLoadState.error} />
    {/if}
  </svelte:boundary>
</main>

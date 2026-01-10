<script lang="ts">
  import { onMount } from "svelte";
  import { getMarkdownStory, type StoryMarkdown } from "$lib/data/items/stories-markdown";
  import { route, p } from "sv-router/generated";
  import { createLoadState } from "$lib/data/async-state.svelte";
  import { validationError } from "$lib/common-library/integrations/error-handling";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import LineAnimated from "$lib/common-library/components/animation/LineAnimated.svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import { scale, fly } from "svelte/transition";
  import StoryFileGallery from "$routes/stories/[id]/_components/StoryFileGallery.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { Section, SectionHeader, Prose } from "$lib/common-library/components/layout";

  let storyLoadState = createLoadState();
  let story: StoryMarkdown | undefined = $state(undefined);

  const params = $derived(route.getParams("/markdown/stories/:storyname"));
  const slug = $derived(params.storyname);

  onMount(async () => {
    storyLoadState.setLoading();

    if (!slug) {
      storyLoadState.setError(validationError({ userMessage: "No story selected", context: "StoryMarkdownPage" }));
      return;
    }

    story = await getMarkdownStory(slug, storyLoadState);
  });
</script>

<Section as="main" class="grid justify-center">
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering story page (from Markdown)." {error} {reset} />
    {/snippet}

    {#if storyLoadState?.loading}
      <StatusMessage type="loading" message="Loading story..." />
    {:else if storyLoadState.ready && story}
      <Prose as="article" variant="withLinks" class="w-full text-pretty">
        <SectionHeader variant="page" class="mt-4 mb-6">
          {#snippet breadcrumbsSnippet()}
            <a class="p-0 flex gap-2 items-center no-underline!" href={p("/markdown/stories")}>
              <ArrowLeft size="24" class="bg-muted/50 border p-1 rounded" />
              Back to Stories
            </a>
          {/snippet}
          {#snippet intro()}
            {#if story}
              <div class="flex gap-2 items-baseline my-4">
                <p class="my-0!">{story.Author.Title}</p>
                |
                <time class="text-sm text-muted-foreground" datetime={new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  >{new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</time
                >
              </div>
            {/if}
          {/snippet}
          <span in:fly={{ x: -50 }}>{story.Title}</span>
        </SectionHeader>

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
      </Prose>
    {:else if storyLoadState?.error}
      <StatusMessage type="error" message={storyLoadState.error} errorDetails={storyLoadState.errorDetails} />
    {/if}
  </svelte:boundary>
</Section>

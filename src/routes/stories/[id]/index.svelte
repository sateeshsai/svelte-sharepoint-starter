<script lang="ts">
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import { cn } from "$lib/utils";
  import { navigate, p, route } from "sv-router/generated";
  import { getStory, getStoryFiles } from "./get.svelte";
  import { postNewStory } from "./post";
  import type { File_ListItem, Story_ListItem } from "$lib/data/types";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { global_State } from "$lib/data/global-state.svelte";
  import PenLine from "@lucide/svelte/icons/pen-line";
  import { getUserFirstLastNames } from "$lib/common-library/integrations/sharepoint-rest-api/helpers";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import { getCurrentUserProperties } from "$lib/common-library/integrations/sharepoint-rest-api/get/getCurrentUserProperties";
  import { LOCAL_SHAREPOINT_USERS_PROPERTIES } from "$lib/common-library/integrations/sharepoint-rest-api/local-data";
  import type { Sharepoint_User_Properties } from "$lib/common-library/integrations/sharepoint-rest-api/types";
  import StoryFileGallery from "./_components/StoryFileGallery.svelte";
  import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { fade, fly, scale, slide } from "svelte/transition";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import LineAnimated from "$lib/common-library/utils/components/ui-utils/Line_Animated.svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";

  const { signal } = useAbortController();

  const params = $derived(route.getParams("/stories/:id"));
  const storyId = $derived(params.id.toLowerCase() === "new" ? undefined : params.id);

  let storyLoadState = new AsyncLoadState();
  let story: Story_ListItem | undefined = $state();
  let userCanEdit = $derived(global_State.AccessRole === "Admin" || story?.Author.Id === global_State.user?.Id);

  $effect(() => {
    loadData();
  });

  const newStorySubmitState = new AsyncSubmitState();

  async function loadData() {
    console.log("X");
    if (!storyId) {
      postNewStory(newStorySubmitState);
      return;
    }

    const storyIdIsInvalid = Number.isNaN(+storyId);

    if (storyIdIsInvalid) {
      navigate("/stories", {
        replace: true,
      });
      return;
    }

    story = await getStory(+storyId, storyLoadState, signal);
  }

  let storyFiles: File_ListItem[] | undefined = $state();
  let storyFilesLoadState = new AsyncLoadState();

  $effect(() => {
    loadStoryFiles(storyId);
  });

  async function loadStoryFiles(story_Id: string | undefined) {
    if (story_Id) {
      storyFiles = await getStoryFiles(+story_Id, storyFilesLoadState, signal);
    }
  }

  trackAnalytics();
</script>

<main class={cn("grid justify-center", PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering story page." {error} {reset} />
    {/snippet}
    {#if storyLoadState?.loading}
      <StatusMessage type="loading" message="Loading story..." />
    {:else if storyLoadState.ready && story}
      <article class="storyContainer prose-sm prose-a:underline prose-a:decoration-muted-foreground prose-a:decoration-1 prose-a:underline-offset-3 max-w-5xl w-full dark:prose-invert text-pretty">
        <Breadcrumb.Root>
          <Breadcrumb.Item>
            <Breadcrumb.Link class="p-0 flex gap-2 items-center no-underline!" href={p("/stories")}>
              <ArrowLeft size="24" class="bg-muted/50 border p-1 rounded" />
              Back to Stories
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.Root>

        <header class="storyHeader mt-4 flex gap-4 justify-between items-start">
          <div>
            <h1 class="mt-4 mb-10" in:fly={{ x: -50 }}>{story.Title}</h1>
            <div class="flex gap-2 items-baseline my-4">
              {#await getCurrentUserProperties( { siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection, dataToReturnInLocalMode: LOCAL_SHAREPOINT_USERS_PROPERTIES.find((u) => u.DisplayName === story?.Author.Title) as Sharepoint_User_Properties } )}
                Loading...
              {:then authorResponse}
                {#if "error" in authorResponse}
                  <p in:fade>{authorResponse.error}</p>
                {:else}
                  {@const authorFullname = getUserFirstLastNames(authorResponse)}
                  <p class="my-0!"><a href="https://people.deloitte/profile/{authorResponse.Email.split('@')[0]}" target="_blank">{authorFullname?.first} {authorFullname?.last}</a></p>
                  |
                {/if}
              {/await}
              <time class="text-sm text-muted-foreground" datetime={new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                >{new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</time
              >
            </div>
          </div>
          {#if userCanEdit}
            <a
              title="Edit story"
              class="text-muted-foreground rounded border border-muted-foreground aspect-square w-7 grid place-items-center"
              href={SHAREPOINT_CONFIG.paths.page + "#/stories/" + story.Id + "/edit"}
            >
              <PenLine size={16} />
              <span class="sr-only">Edit story</span></a
            >
          {/if}
        </header>

        <img in:scale|global={{ start: 0 }} alt={story.Title} src={"./assets/StoryFiles/" + story.CoverFileName} class="rounded-md mt-2 max-h-75 w-full object-cover object-center" />

        <h3 class="">{story.Introduction}</h3>
        <LineAnimated class="mt-8 mb-6" />
        <div class="storyContent">
          {@html story.Content}
        </div>

        <section class="mt-8">
          {#if storyFilesLoadState?.loading}
            Loading files...
          {:else if storyFilesLoadState?.ready && storyFiles}
            <StoryFileGallery folderPath="./assets/StoryFiles/" files={storyFiles} />
          {:else if storyFilesLoadState?.error}
            <p>{storyFilesLoadState.error}</p>
          {/if}
        </section>
      </article>
    {:else if storyLoadState?.error}
      <StatusMessage type="error" message={storyLoadState.error} />
    {/if}
  </svelte:boundary>
</main>

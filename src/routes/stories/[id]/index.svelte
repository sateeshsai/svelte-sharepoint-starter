<script lang="ts">
  import { navigate, p, route } from "sv-router/generated";
  import { getStory, getStoryFiles, pollStoryEngagements, postNewStory, addEngagement, removeEngagement } from "$lib/data/items/stories";
  import { getUserPropertiesById } from "$lib/data/items/users";
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import type { File_ListItem } from "$lib/data/items/files/schemas";
  import type { Engagement_ListItem } from "$lib/common-library/integrations";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { canEditItem } from "$lib/data/global-state.svelte";
  import PenLine from "@lucide/svelte/icons/pen-line";
  import { getUserFirstLastNames, type Sharepoint_User_Properties } from "$lib/common-library/integrations";
  import { createLoadState, createSubmitState } from "$lib/data/async-state.svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import StoryFileGallery from "./_components/StoryFileGallery.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { fly, scale } from "svelte/transition";
  import LineAnimated from "$lib/common-library/components/animation/LineAnimated.svelte";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { useAbortController } from "$lib/hooks/useAbortController.svelte";
  import { EngagementSection } from "$lib/common-library/integrations/components/engagements";
  import { Section, SectionHeader, Prose } from "$lib/common-library/components/layout";

  const { signal } = useAbortController();

  const params = $derived(route.getParams("/stories/:id"));
  const storyId = $derived(params.id.toLowerCase() === "new" || params.id.toLowerCase() === "create" ? undefined : params.id);

  let storyLoadState = createLoadState();
  let story: Story_ListItem | undefined = $state();
  let currentUserCanEdit = $derived(canEditItem(story?.Author?.Id));

  $effect(() => {
    loadData();
  });

  const newStorySubmitState = createSubmitState();

  async function loadData() {
    if (!storyId) {
      postNewStory(newStorySubmitState);
      return;
    }

    if (Number.isNaN(+storyId)) {
      navigate("/stories", { replace: true });
      return;
    }

    story = await getStory(+storyId, storyLoadState, signal);
  }

  let storyFiles: File_ListItem[] | undefined = $state();
  let storyFilesLoadState = createLoadState();

  $effect(() => {
    loadStoryFiles(storyId);
  });

  async function loadStoryFiles(story_Id: string | undefined) {
    if (story_Id) {
      storyFiles = await getStoryFiles(+story_Id, storyFilesLoadState, signal);
    }
  }

  let authorProperties: Sharepoint_User_Properties | undefined = $state();

  $effect(() => {
    loadAuthorProperties(story?.Author?.Id);
  });

  async function loadAuthorProperties(authorId: number | undefined) {
    if (!authorId) return;
    authorProperties = await getUserPropertiesById(authorId);
  }

  let engagements: Engagement_ListItem[] | undefined = $state();
  let engagementsLoadState = createLoadState();
  let ReactionSubmissionIsInProgress = $state(false);
  let CommentSubmissionIsInProgress = $state(false);

  // Poll for engagement updates - starts automatically when storyId is set
  let stopPolling: (() => void) | undefined;

  $effect(() => {
    // Clean up previous polling when storyId changes
    if (stopPolling) {
      stopPolling();
      stopPolling = undefined;
    }

    if (storyId) {
      engagementsLoadState.setLoading();
      stopPolling = pollStoryEngagements(
        +storyId,
        (data) => {
          engagements = data;
        },
        engagementsLoadState
      );
    }

    // Cleanup on component unmount
    return () => {
      if (stopPolling) {
        stopPolling();
      }
    };
  });

  async function onAddReaction(emoji: string) {
    if (!storyId || !story) return;
    engagements = await addEngagement({
      parentId: +storyId,
      parentTitle: story.Title,
      parentType: "Story",
      engagementType: "Reaction",
      content: emoji,
      engagements,
      signal,
    });
  }

  async function onAddComment(text: string) {
    if (!storyId || !story) return;
    engagements = await addEngagement({
      parentId: +storyId,
      parentTitle: story.Title,
      parentType: "Story",
      engagementType: "Comment",
      content: text,
      engagements,
      signal,
    });
  }

  async function onDeleteEngagement(id: number) {
    engagements = await removeEngagement({ engagementId: id, engagements, signal });
  }

  trackAnalytics();
</script>

<Section as="main" class="grid justify-center">
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering story page." {error} {reset} />
    {/snippet}

    {#if storyLoadState?.loading}
      <StatusMessage type="loading" message="Loading story..." />
    {:else if storyLoadState.ready && story}
      <Prose as="article" variant="withLinks" class="w-full text-pretty">
        <SectionHeader variant="page" class="mt-4 mb-6">
          {#snippet breadcrumbsSnippet()}
            <a class="p-0 flex gap-2 items-center no-underline!" href={p("/stories")}>
              <ArrowLeft size="24" class="bg-muted/50 border p-1 rounded" />
              Back to Stories
            </a>
          {/snippet}
          {#snippet actions()}
            {#if currentUserCanEdit && story}
              <a
                title="Edit story"
                class="text-muted-foreground rounded border border-muted-foreground aspect-square w-7 grid place-items-center"
                href={SHAREPOINT_CONFIG.paths.page + "#/stories/" + story.Id + "/edit"}
              >
                <PenLine size={16} />
                <span class="sr-only">Edit story</span>
              </a>
            {/if}
          {/snippet}
          {#snippet intro()}
            {#if story}
              <div class="flex gap-2 items-baseline my-4">
                {#if authorProperties}
                  {@const authorFullname = getUserFirstLastNames(authorProperties)}
                  <p class="my-0!"><a href="https://people.deloitte/profile/{authorProperties.Email.split('@')[0]}" target="_blank">{authorFullname?.first} {authorFullname?.last}</a></p>
                  |
                {/if}
                <time class="text-sm text-muted-foreground" datetime={new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  >{new Date(story.Modified).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</time
                >
              </div>
            {/if}
          {/snippet}
          <span in:fly={{ x: -50 }}>{story.Title}</span>
        </SectionHeader>

        <!-- Reactions Section at Top -->
        <EngagementSection
          {engagements}
          {engagementsLoadState}
          {onAddReaction}
          {onAddComment}
          {onDeleteEngagement}
          bind:ReactionSubmissionIsInProgress
          bind:CommentSubmissionIsInProgress
          mode="reactions"
        />

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

        <!-- Comments Section at Bottom -->
        <EngagementSection
          {engagements}
          {engagementsLoadState}
          {onAddReaction}
          {onAddComment}
          {onDeleteEngagement}
          bind:ReactionSubmissionIsInProgress
          bind:CommentSubmissionIsInProgress
          mode="comments"
        />
      </Prose>
    {:else if storyLoadState?.error}
      <StatusMessage type="error" message={storyLoadState.error} errorDetails={storyLoadState.errorDetails} />
    {/if}
  </svelte:boundary>
</Section>

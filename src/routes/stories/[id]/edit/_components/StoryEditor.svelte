<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import type { File_ListItem } from "$lib/data/items/files/schemas";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { storyFilesSchema } from "$lib/data/items/files/schemas";
  import { StoryPostSchema } from "$lib/data/items/stories/schemas";
  import { storyToPost } from "$lib/data/items/stories/factory";
  import { fileToPost } from "$lib/data/items/files/factory";
  import { z } from "zod";
  import { cn } from "$lib/utils";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { p } from "sv-router/generated";
  import { updateStory } from "$lib/data/items/stories";
  import { AsyncLoadState, AsyncSubmitState, validationError } from "$lib/common-library/integrations/error-handling";
  import { slide } from "svelte/transition";
  import { ImageCropperState } from "$lib/common-library/components/media";
  import EditStoryFiles from "./_components/_story-files/EditStoryFiles.svelte";
  import EditStoryCoverImage from "./_components/_cover-image/EditStoryCoverImage.svelte";
  import EditStoryContent from "./_components/_content/EditStoryContent.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { SectionHeader } from "$lib/common-library/components/layout";

  let { story = $bindable() }: { story: Story_ListItem } = $props();

  let storyDataToPost_ValidationErrors = $derived.by(() => {
    const dataToPost = storyToPost(story);
    const storyDataToPost_ValidationResult = StoryPostSchema.safeParse(dataToPost);
    return storyDataToPost_ValidationResult.error ? z.flattenError(storyDataToPost_ValidationResult.error) : undefined;
  });

  let storyFilesLoadState = $state(new AsyncLoadState());
  let storyFiles: File_ListItem[] | undefined = $state();

  let filesValidationErrors: z.core.$ZodIssue[] = $derived.by(() => {
    const validationResult = storyFilesSchema.safeParse({
      files: storyFiles?.map((sf) => fileToPost(sf)),
    });

    return validationResult.error?.issues ?? [];
  });

  let fileInMemory: File | undefined = $state();

  const storySubmissionState = new AsyncSubmitState();

  function submitStory(e: Event) {
    e.preventDefault();
    if (Object.values(storyDataToPost_ValidationErrors?.fieldErrors ?? {}).length) {
      storySubmissionState.setError(validationError({ userMessage: "Form is incomplete or has invalid inputs. Please check and try again.", context: "Validating story form" }));
      return;
    }

    if (filesValidationErrors.length) {
      if (filesValidationErrors.find((e) => e.path.length > 1)) {
        storySubmissionState.setError(validationError({ userMessage: "File details are incomplete or have invalid input. Please check and try again.", context: "Validating file details" }));
      } else {
        storySubmissionState.setError(validationError({ userMessage: "Add at least one file.", context: "Validating file details" }));
      }
      return;
    }

    updateStory(story, storySubmissionState);
  }

  export const coverImageUploadState = new AsyncSubmitState();
</script>

<article in:slide|global class={cn("stories h-full")}>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering story editor." {error} {reset} />
    {/snippet}

    {#if !storySubmissionState.success}
      <form onsubmit={submitStory} class={cn("max-w-4xl w-full justify-self-center", storySubmissionState.inProgress ? "select-none prose-sm pointer-events-none opacity-50 blur" : null)}>
        <SectionHeader
          variant="page"
          class="my-8"
          breadcrumbs={[{ label: "Stories", href: p("/stories") }, { label: story.Title, href: p("/stories/:id", { params: { id: String(story.Id) } }) }, { label: "Edit" }]}
        >
          {#snippet intro()}
            <p class="mb-8">Form instructions here. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          {/snippet}
          Story editor
        </SectionHeader>
        <div class="grid gap-6">
          <Field.Set class="grid gap-6">
            <Field.Field>
              <Field.Label for="story-title">Title</Field.Label>
              <Input id="story-title" bind:value={story.Title} />
              {#if storySubmissionState.attempted && storyDataToPost_ValidationErrors?.fieldErrors.Title}
                <Field.Error>{storyDataToPost_ValidationErrors?.fieldErrors.Title}</Field.Error>
              {/if}
            </Field.Field>

            <EditStoryCoverImage {storySubmissionState} {storyDataToPost_ValidationErrors} bind:story />

            <Field.Field>
              <Field.Label for="story-tags">Tags</Field.Label>
              <Input id="story-tags" placeholder="tag1, tag2, etc." bind:value={story.Tags} />
              {#if storySubmissionState.attempted && storyDataToPost_ValidationErrors?.fieldErrors.Tags}
                <Field.Error>{storyDataToPost_ValidationErrors?.fieldErrors.Tags}</Field.Error>
              {/if}
            </Field.Field>

            <Field.Field>
              <Field.Label for="story-intro">Introduction</Field.Label>
              <Textarea id="story-intro" bind:value={story.Introduction} />
              {#if storySubmissionState.attempted && storyDataToPost_ValidationErrors?.fieldErrors.Introduction}
                <Field.Error>{storyDataToPost_ValidationErrors?.fieldErrors.Introduction}</Field.Error>
              {/if}
            </Field.Field>
          </Field.Set>

          <Field.Field>
            <Field.Label for="story-intro">Content</Field.Label>
            <EditStoryContent bind:content={story.Content} />
            {#if storySubmissionState.attempted && storyDataToPost_ValidationErrors?.fieldErrors.Content}
              <Field.Error>{storyDataToPost_ValidationErrors?.fieldErrors.Content}</Field.Error>
            {/if}
          </Field.Field>

          <EditStoryFiles submissionAttempted={storySubmissionState.attempted} {filesValidationErrors} storyId={story.Id} bind:storyFilesLoadState bind:storyFiles />

          <Field.Field orientation="horizontal" class="flex flex-col mt-8">
            <div class="flex justify-center gap-4">
              <Button type="submit" disabled={storySubmissionState.inProgress}>
                {#if storySubmissionState.inProgress}
                  <LoaderCircle class="animate-spin" />
                {:else}
                  Submit story
                {/if}
              </Button>
              <Button variant="outline" type="button">Cancel</Button>
            </div>
            {#if storySubmissionState.error}
              <Field.Error class="justify-self-center text-center mt-4">{storySubmissionState.error}</Field.Error>
            {/if}
          </Field.Field>
        </div>
      </form>
    {:else}
      <StatusMessage type="success" message="All done!" class="gap-4">
        <div class="actions grid gap-2">
          <Button onclick={storySubmissionState.resetForm} variant="outline" size="sm" href={p("/stories/:id", { params: { id: String(story.Id) } })}>Go to the story</Button>
          <Button onclick={storySubmissionState.resetForm} variant="outline" size="sm" href={p("/stories/:id", { params: { id: "new" } })}>Submit another story</Button>
        </div>
      </StatusMessage>
    {/if}
  </svelte:boundary>
</article>

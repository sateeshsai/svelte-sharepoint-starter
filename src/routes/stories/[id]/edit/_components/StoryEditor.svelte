<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import type { File_ListItem, Story_ListItem } from "$lib/data/types";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { storyFilesSchema, StoryPostSchema } from "$lib/data/schemas";
  import { convert_File_ListItem_To_Post, convert_Story_ListItem_ToPost } from "$lib/data/convert-items";
  import { z } from "zod";
  import { cn } from "$lib/utils";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { p } from "sv-router/generated";
  import { updateStory } from "./post.svelte";
  import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/functions/async.svelte";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import { slide } from "svelte/transition";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { ImageCropperState } from "$lib/common-library/utils/components/cropper/cropperState.svelte";
  import EditStoryFiles from "./_components/_story-files/EditStoryFiles.svelte";
  import EditStoryCoverImage from "./_components/_cover-image/EditStoryCoverImage.svelte";
  import EditStoryContent from "./_components/_content/EditStoryContent.svelte";

  let { story = $bindable() }: { story: Story_ListItem } = $props();

  let storyDataToPost_ValidationErrors = $derived.by(() => {
    const dataToPost = convert_Story_ListItem_ToPost(story);
    const storyDataToPost_ValidationResult = StoryPostSchema.safeParse(dataToPost);
    return storyDataToPost_ValidationResult.error ? z.flattenError(storyDataToPost_ValidationResult.error) : undefined;
  });

  let storyFilesLoadState = $state(new AsyncLoadState<File_ListItem[]>());
  let storyFiles: File_ListItem[] | undefined = $state();

  let filesValidationErrors: z.core.$ZodIssue[] = $derived.by(() => {
    const validationResult = storyFilesSchema.safeParse({
      files: storyFiles?.map((sf) => convert_File_ListItem_To_Post(sf)),
    });

    return validationResult.error?.issues ?? [];
  });

  let fileInMemory: File | undefined = $state();

  export const coverimageCropperState = new ImageCropperState();

  async function addCoverImage(files: File[]) {
    fileInMemory = files[0];
    coverimageCropperState.sourceImageSrc = URL.createObjectURL(fileInMemory);
    coverimageCropperState.showFileDropZone = false;
    coverimageCropperState.showCropper = true;
  }

  const storySubmissionState = new AsyncSubmitState();

  function submitStory(e: Event) {
    storySubmissionState.setAttempted();
    e.preventDefault();
    if (Object.values(storyDataToPost_ValidationErrors?.fieldErrors ?? {}).length) {
      //FORM VALIDATION FAILED
      storySubmissionState.setError("Form is incomplete or has invalid inputs. Please check and try again.");
      return;
    }

    if (filesValidationErrors.length) {
      //FORM VALIDATION FAILED
      if (filesValidationErrors.find((e) => e.path.length > 1)) {
        storySubmissionState.setError("File details are incomplete or have invalid input. Please check and try again.");
      } else {
        storySubmissionState.setError("Add atleast one file.");
      }
      return;
    }

    updateStory(story, storySubmissionState);
  }

  export const coverImageUploadState = new AsyncSubmitState();
</script>

<article in:slide|global class={cn("stories h-full")}>
  {#if !storySubmissionState.success}
    <form onsubmit={submitStory} class={cn("max-w-4xl w-full justify-self-center", storySubmissionState.inProgress ? "select-none prose-sm pointer-events-none opacity-50 blur" : null)}>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href={p("/stories")}>Stories</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href={p("/stories/:id", { params: { id: String(story.Id) } })}>{story.Title}</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Edit</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <h1 class="text-2xl font-light my-8">Story editor</h1>
      <p class="mb-8">Form instructions here. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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
</article>

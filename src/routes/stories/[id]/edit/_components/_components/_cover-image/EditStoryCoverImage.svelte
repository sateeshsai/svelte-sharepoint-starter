<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import Button from "$lib/components/ui/button/button.svelte";
  import { CropperJsWrapper, FileDropZoneWrapper, ImageCropperState } from "$lib/common-library/components/media";
  import Image from "@lucide/svelte/icons/image";
  import PenLine from "@lucide/svelte/icons/pen-line";
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import { createSubmitState, type AsyncSubmitState } from "$lib/data/async-state.svelte";
  import type { typeToFlattenedError } from "zod/v3";
  import { uploadCroppedImage } from "$lib/data/items/files";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";

  interface Props {
    story: Story_ListItem;
    storySubmissionState: AsyncSubmitState;
    storyDataToPost_ValidationErrors: typeToFlattenedError<Story_ListItem> | undefined;
  }

  const { story = $bindable(), storySubmissionState, storyDataToPost_ValidationErrors }: Props = $props();

  let fileInMemory: File | undefined = $state();

  export const coverImageCropperState = new ImageCropperState();

  async function addCoverImage(files: File[]) {
    fileInMemory = files[0];
    coverImageCropperState.sourceImageSrc = URL.createObjectURL(fileInMemory);
    coverImageCropperState.showFileDropZone = false;
    coverImageCropperState.showCropper = true;
  }

  export const coverImageUploadState = createSubmitState();

  async function handleUploadCroppedImage(dataUri: string) {
    coverImageCropperState.showFileDropZone = true;
    coverImageCropperState.showCropper = false;

    const fileUploadSuccessResponse = await uploadCroppedImage(dataUri, fileInMemory as File, coverImageUploadState);

    if (coverImageUploadState.success && fileUploadSuccessResponse) {
      coverImageCropperState.croppedImageDataUri_ForLocalMode = dataUri;
      story.CoverFileName = fileUploadSuccessResponse.Name;
      coverImageCropperState.showFileDropZone = false;
    }

    return;
  }
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering story cover image editor." {error} {reset} />
  {/snippet}

  <Field.Field>
    <Field.Label for="story-cover-img" class="flex justify-between">
      <p>Cover image <span class="text-muted-foreground font-light"></span></p>
      <Button variant="outline" size="icon" class="h-7 w-7.5" onclick={() => (coverImageCropperState.showFileDropZone = true)}>
        <PenLine />
      </Button>
    </Field.Label>

    {#if story.CoverFileName && !coverImageCropperState.showFileDropZone && !coverImageCropperState.showCropper}
      <div class="preview relative h-72" id="story-cover-img">
        <img
          id="image"
          src={LOCAL_MODE && fileInMemory ? coverImageCropperState.croppedImageDataUri_ForLocalMode : "./assets/images/" + story.CoverFileName}
          alt="CropperPic"
          class="bg-muted/30 rounded overflow-hidden h-full w-full object-cover object-center"
        />
      </div>
    {/if}

    {#if coverImageCropperState.showCropper}
      <CropperJsWrapper
        handleCropped={(dataUri) => handleUploadCroppedImage(dataUri)}
        id="story-cover-img"
        bind:showCropper={coverImageCropperState.showCropper}
        bind:sourceSrc={coverImageCropperState.sourceImageSrc}
      />
    {/if}

    {#if coverImageCropperState.showFileDropZone || !story.CoverFileName}
      <div id="story-cover-img" class="grid min-h-72 rounded-lg border border-dashed border-input">
        <FileDropZoneWrapper elementId="file-upload" fileUploadState={coverImageUploadState} onFileAdd={addCoverImage} accept="image/*" maxFiles={1} fileCount={0}>
          {#snippet icon()}
            <Image />
          {/snippet}
        </FileDropZoneWrapper>
      </div>
    {/if}

    {#if storySubmissionState.attempted && storyDataToPost_ValidationErrors?.fieldErrors.CoverFileName}
      <Field.Error>{storyDataToPost_ValidationErrors?.fieldErrors.CoverFileName}</Field.Error>
    {/if}

    {#if coverImageUploadState?.error}
      <Field.Error>{coverImageUploadState?.error}</Field.Error>
    {/if}
  </Field.Field>
</svelte:boundary>

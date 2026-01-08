<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import type { Story_ListItem } from "$lib/data/items/stories/schemas";
  import Button from "$lib/components/ui/button/button.svelte";
  import CropperJsWrapper from "$lib/common-library/utils/components/cropper/CropperJsWrapper.svelte";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import Image from "@lucide/svelte/icons/image";
  import PenLine from "@lucide/svelte/icons/pen-line";
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import { SharePointAsyncSubmitState } from "$lib/common-library/integrations/error-handling";
  import { ImageCropperState } from "$lib/common-library/utils/components/cropper/cropperState.svelte";
  import type { typeToFlattenedError } from "zod/v3";
  import { uploadCroppedImage } from "$lib/data/items/files";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";

  interface Props {
    story: Story_ListItem;
    storySubmissionState: SharePointAsyncSubmitState;
    storyDataToPost_ValidationErrors: typeToFlattenedError<Story_ListItem> | undefined;
  }

  const { story = $bindable(), storySubmissionState, storyDataToPost_ValidationErrors }: Props = $props();

  let fileInMemory: File | undefined = $state();

  export const coverimageCropperState = new ImageCropperState();

  async function addCoverImage(files: File[]) {
    fileInMemory = files[0];
    coverimageCropperState.sourceImageSrc = URL.createObjectURL(fileInMemory);
    coverimageCropperState.showFileDropZone = false;
    coverimageCropperState.showCropper = true;
  }

  export const coverImageUploadState = new SharePointAsyncSubmitState();

  async function handleUploadCroppedImage(dataUri: string) {
    coverimageCropperState.showFileDropZone = true;
    coverimageCropperState.showCropper = false;

    const fileUploadSuccessResponse = await uploadCroppedImage(dataUri, fileInMemory as File, coverImageUploadState);

    if (coverImageUploadState.success && fileUploadSuccessResponse) {
      coverimageCropperState.croppedImageDataUri_ForLocalMode = dataUri;
      story.CoverFileName = fileUploadSuccessResponse.Name;
      coverimageCropperState.showFileDropZone = false;
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
      <Button variant="outline" size="icon" class="h-7 w-7.5" onclick={() => (coverimageCropperState.showFileDropZone = true)}>
        <PenLine />
      </Button>
    </Field.Label>

    {#if story.CoverFileName && !coverimageCropperState.showFileDropZone && !coverimageCropperState.showCropper}
      <div class="preview relative h-72" id="story-cover-img">
        <img
          id="image"
          src={LOCAL_MODE && fileInMemory ? coverimageCropperState.croppedImageDataUri_ForLocalMode : "./assets/images/" + story.CoverFileName}
          alt="CropperPic"
          class="bg-muted/30 rounded overflow-hidden h-full w-full object-cover object-center"
        />
      </div>
    {/if}

    {#if coverimageCropperState.showCropper}
      <CropperJsWrapper
        handleCropped={(dataUri) => handleUploadCroppedImage(dataUri)}
        id="story-cover-img"
        bind:showCropper={coverimageCropperState.showCropper}
        bind:sourceSrc={coverimageCropperState.sourceImageSrc}
      />
    {/if}

    {#if coverimageCropperState.showFileDropZone}
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

<script lang="ts">
  import { FILE_INPUT_ACCEPT_STRINGS, FileDropZoneWrapper } from "$lib/common-library/components/media";
  import { AsyncSubmitState } from "$lib/common-library/integrations/error-handling";
  import FileUp from "@lucide/svelte/icons/file-up";
  import * as Field from "$lib/components/ui/field/index.js";
  import type { File_ListItem } from "$lib/data/items/files/schemas";
  import { uploadStoryFiles } from "$lib/data/items/files";
  import { global_State } from "$lib/data/global-state.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  let { storyFiles = $bindable(), storyId, fileUploadState = $bindable() }: { storyFiles: File_ListItem[]; storyId: number; fileUploadState: AsyncSubmitState } = $props();

  const MAX_FILES_ALLOWED = 10;

  async function handleUploadStoryFiles(files: File[]) {
    fileUploadState.resetForm();
    const fileDetailsPostSuccessResponses = await uploadStoryFiles(files, storyFiles, storyId, fileUploadState);
    //3. LOCAL MODE UPDATE - Add new files to local state
    if (fileDetailsPostSuccessResponses) {
      fileDetailsPostSuccessResponses.forEach((data) => {
        // POST response returns flat fields (AuthorId, ParentId)
        // Construct expanded format for local state display
        const fileDetails_ListItem: File_ListItem = {
          Id: data.Id,
          Author: {
            Id: data.AuthorId,
            Title: global_State.currentUser?.Title ?? "Unknown",
          },
          FileOrder: data.FileOrder,
          Created: data.Created,
          Modified: data.Modified,
          Title: data.Title,
          Parent: { Id: data.ParentId, Title: "" },
          Description: data.Description,
          ParentType: data.ParentType,
        };
        storyFiles.push(fileDetails_ListItem);
      });
    }
  }
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering story files uploader." {error} {reset} />
  {/snippet}

  <Field.Field>
    <Field.Label for="file-upload" class="sr-only">Add {storyFiles.length ? "more files" : ""}</Field.Label>
    <div class="grid min-h-32 rounded-lg border border-dashed border-input">
      <FileDropZoneWrapper
        elementId="file-upload"
        {fileUploadState}
        onFileAdd={(files) => handleUploadStoryFiles(files)}
        accept={FILE_INPUT_ACCEPT_STRINGS.all}
        maxFiles={MAX_FILES_ALLOWED}
        fileCount={storyFiles.length}
      >
        {#snippet icon()}
          <FileUp />
        {/snippet}
      </FileDropZoneWrapper>
    </div>
    {#if fileUploadState.error}
      <Field.Error>{fileUploadState.error}</Field.Error>
    {/if}
  </Field.Field>
</svelte:boundary>

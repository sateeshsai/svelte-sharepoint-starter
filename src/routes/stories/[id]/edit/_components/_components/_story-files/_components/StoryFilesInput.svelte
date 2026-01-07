<script lang="ts">
  import { FILE_INPUT_ACCEPT_STRINGS } from "$lib/common-library/utils/components/file/file_utils";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import FileUp from "@lucide/svelte/icons/file-up";
  import * as Field from "$lib/components/ui/field/index.js";
  import type { File_ListItem } from "$lib/data/types";
  import { uploadStoryFiles } from "./post.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";
  let { storyFiles = $bindable(), storyId, fileUploadState = $bindable() }: { storyFiles: File_ListItem[]; storyId: number; fileUploadState: AsyncSubmitState } = $props();

  const MAX_FILES_ALLOWED = 10;

  async function handleUploadStoryFiles(files: File[]) {
    fileUploadState.resetForm();
    const fileDetailsPostSuccessResponses = await uploadStoryFiles(files, storyFiles, storyId, fileUploadState);
    //3. LOCAL MODE UPDATE - Add new files to local state
    if (fileDetailsPostSuccessResponses) {
      fileDetailsPostSuccessResponses.forEach((data) => {
        // postListItem returns flat data (odata=nometadata format)
        const fileDetails_ListItem: File_ListItem = {
          Id: data.Id,
          Author: data.Author,
          FileOrder: data.FileOrder,
          Created: data.Created,
          Modified: data.Modified,
          Title: data.Title,
          Parent: data.Parent ?? { Id: data.ParentId, Title: "" },
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

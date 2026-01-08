<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import FilePreview from "$lib/common-library/utils/components/file/FilePreview.svelte";
  import StoryFilesInput from "./_components/StoryFilesInput.svelte";
  import Trash from "@lucide/svelte/icons/trash";
  import { cn } from "$lib/utils";
  import { getStoryFiles } from "$lib/data/items/stories";
  import { deleteStoryFile, updateStoryFile } from "$lib/data/items/files";
  import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import { flip } from "svelte/animate";
  import type { File_ListItem } from "$lib/data/types";
  import { z } from "zod";
  import { crossfade } from "svelte/transition";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),
  });

  let {
    storyId,
    storyFiles = $bindable(),
    storyFilesLoadState = $bindable(),
    filesValidationErrors,
    submissionAttempted,
  }: {
    storyId: number;
    storyFiles: File_ListItem[] | undefined;
    storyFilesLoadState: AsyncLoadState;
    filesValidationErrors: z.core.$ZodIssue[];
    submissionAttempted: boolean;
  } = $props();

  $effect(() => {
    loadData(storyId);
  });

  async function loadData(story_Id: number) {
    storyFiles = await getStoryFiles(story_Id, storyFilesLoadState);
  }

  const storyFilesSorted: File_ListItem[] = $derived([...(storyFiles ?? [])]?.sort((a, b) => (a.FileOrder > b.FileOrder ? 1 : -1)) ?? []);

  let fileUploadState = $state(new AsyncSubmitState());
  let updateFileOrderState = $state(new AsyncSubmitState());

  async function updateFileOrder(direction: "left" | "right", fileId: number) {
    const fileToReorder = storyFiles?.find((f) => f.Id === fileId)!;
    const fileToReorderCurrentOrder = fileToReorder.FileOrder;
    const siblingFileToReorder = direction === "left" ? storyFiles?.find((f) => f.FileOrder === fileToReorderCurrentOrder - 1) : storyFiles?.find((f) => f.FileOrder === fileToReorderCurrentOrder + 1);

    if (siblingFileToReorder) fileToReorder.FileOrder = siblingFileToReorder.FileOrder;
    await updateStoryFile(fileToReorder.Id, { FileOrder: fileToReorder.FileOrder }, updateFileOrderState);

    //UPDATE SIBLING FILE ORDER
    if (siblingFileToReorder) {
      siblingFileToReorder.FileOrder = fileToReorderCurrentOrder;
      updateStoryFile(siblingFileToReorder.Id, { FileOrder: siblingFileToReorder.FileOrder }, updateFileOrderState);
    }
  }

  let deleteFileState = $state(new AsyncSubmitState());
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering story files editor." {error} {reset} />
  {/snippet}
  {#if storyFilesLoadState?.loading}
    <StatusMessage type="loading" message="Loading files..." />
  {:else if storyFilesLoadState.ready && storyFiles}
    <Field.Group class="gap-3">
      <Field.Description class="text-foreground mb-0">Story files</Field.Description>

      <StoryFilesInput bind:fileUploadState bind:storyFiles {storyId} />

      <div role="none" class="files grid md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {#each storyFilesSorted as file, idx (file.Id)}
          {@const fileValidationError = filesValidationErrors.find((e) => e.path[1] === idx)}
          <div class="grid group" in:receive={{ key: file.Id, duration: 500 }} out:send={{ key: file.Id, duration: 500 }} animate:flip={{ duration: 500 }}>
            {console.log(file)}
            <Field.Set class="file gap-0 rounded overflow-hidden bg-muted/80 border">
              <div class="grid relative content-stretch">
                <button
                  disabled={updateFileOrderState.inProgress}
                  title="Move left"
                  class={cn("group-hover:scale-100 scale-0  transition-transform bg-muted z-10 rounded p-0.5 border shadow  absolute left-1 top-[50%] translate-y-[-50%]", !idx ? "hidden" : null)}
                  type="button"
                  onclick={() => updateFileOrder("left", file.Id)}
                >
                  <ArrowLeft size="20" />
                </button>
                <button
                  disabled={updateFileOrderState.inProgress}
                  title="Move right"
                  class={cn(
                    "group-hover:scale-100 scale-0 transition-transform bg-muted z-10 rounded p-0.5 border shadow  absolute right-1 top-[50%] translate-y-[-50%]",
                    idx === storyFiles.length - 1 ? "hidden" : null
                  )}
                  type="button"
                  onclick={() => updateFileOrder("right", file.Id)}
                >
                  <ArrowRight size="20" />
                </button>

                <button
                  disabled={deleteFileState.inProgress}
                  type="button"
                  class="group-hover:scale-100 scale-0 transition-transform z-10 rounded p-1 border shadow absolute top-2 right-2 bg-destructive border-white/50"
                  onclick={async () => {
                    await deleteStoryFile(file.Id, deleteFileState);
                    if (deleteFileState.success) {
                      storyFiles = storyFiles?.filter((sf) => sf.Id !== file.Id);
                    }
                  }}
                  title="Delete file"
                >
                  <Trash size="16" />
                </button>

                <FilePreview class="h-48 object-cover" id={"file-" + file.Id} src={"./assets/StoryFiles/" + file.Title} options={{ image: { alt: file.Description } }} />
              </div>
              <Field.Field class="fileInfo gap-1  p-2 self-end border-t">
                <Field.Label class="text-xs" for="file-description-{file.Id}">Caption</Field.Label>
                <Input id="file-description-{file.Id}" class="" bind:value={file.Description} />
                {#if submissionAttempted && fileValidationError}
                  <Field.Error>{fileValidationError.message}</Field.Error>
                {/if}
                {#if deleteFileState.error}
                  <Field.Error>{deleteFileState.error}</Field.Error>
                {/if}
              </Field.Field>
            </Field.Set>
          </div>
        {/each}

        {#if updateFileOrderState.error}
          <StatusMessage type="error" message={updateFileOrderState.error} />
        {/if}
      </div>
    </Field.Group>
  {/if}

  {#if storyFilesLoadState?.error}
    <StatusMessage type="error" message={storyFilesLoadState.error} />
  {/if}
</svelte:boundary>

<script lang="ts">
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import type { NodeViewProps } from "@tiptap/core";
  import Audio from "@lucide/svelte/icons/audio-lines";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { AsyncSubmitState, validationError, apiError } from "$lib/common-library/integrations/error-handling";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import MediaPlaceHolder from "$lib/common-library/integrations/components/edra-rich-text/components/MediaPlaceHolder.svelte";
  import { randomIdString } from "$lib/common-library/utils/functions/string";
  import { getContext } from "svelte";
  import { EDRA_FILE_UPLOAD_KEY, type EdraFileUploadContext } from "../../../edra-rich-text/context";

  const { editor }: NodeViewProps = $props();
  const uploadContext = getContext<EdraFileUploadContext | undefined>(EDRA_FILE_UPLOAD_KEY);

  const fileUploadState = new AsyncSubmitState();

  async function addFile(files: File[]) {
    const file = files?.[0];
    if (!file) {
      fileUploadState.setError(validationError({ userMessage: "No file selected", context: "AudioPlaceholder" }));
      return;
    }

    if (!uploadContext) {
      // Fallback: use local blob URL in dev mode, otherwise prompt for URL
      if (LOCAL_MODE) {
        const fileUrl = URL.createObjectURL(file);
        editor.chain().focus().setAudio(fileUrl).run();
      } else {
        handleClick();
      }
      return;
    }

    const result = await uploadContext.upload(file, fileUploadState);

    if ("error" in result) {
      fileUploadState.setError(apiError({ userMessage: "Audio upload failed", technicalMessage: result.error, context: "AudioPlaceholder" }));
      return;
    }

    editor.chain().focus().setAudio(result.url).run();
    fileUploadState.resetForm();
  }

  function handleClick() {
    const audioUrl = prompt("Please enter the audio URL");
    if (audioUrl) {
      editor.chain().focus().setAudio(audioUrl).run();
    }
  }
</script>

<!-- onClick={handleClick} -->
<MediaPlaceHolder class={buttonVariants({ variant: "secondary", class: "my-2 h-full min-h-32 w-full" })} icon={Audio} title="Insert an audio">
  <div>
    <FileDropZoneWrapper
      elementId={randomIdString()}
      onFileAdd={addFile}
      accept="audio/*"
      fileType="audio file"
      maxFiles={1}
      {fileUploadState}
      class="flex h-10 w-full max-w-none grow gap-2 border-none"
    >
      {#snippet icon()}
        <Audio />
      {/snippet}
    </FileDropZoneWrapper>
  </div>
</MediaPlaceHolder>

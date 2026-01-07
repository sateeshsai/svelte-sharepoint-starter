<script lang="ts">
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import type { NodeViewProps } from "@tiptap/core";
  import Audio from "@lucide/svelte/icons/audio-lines";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { SharePointAsyncSubmitState } from "$lib/common-library/integrations/error-handling";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import MediaPlaceHolder from "$lib/common-library/integrations/components/edra-rich-text/components/MediaPlaceHolder.svelte";
  import { randomIdString } from "$lib/common-library/utils/functions/string";
  // TODO: Decouple this from app-specific config. Use props or context instead.
  import { uploadFile } from "../post.svelte";

  const { editor }: NodeViewProps = $props();

  const fileUploadState = new SharePointAsyncSubmitState();

  async function addFile(files: File[]) {
    await uploadFile(files, fileUploadState);

    if (fileUploadState.success) {
      const file = files?.[0]!;
      const fileUrl = LOCAL_MODE ? URL.createObjectURL(file) : file.name;
      if (fileUrl) {
        editor.chain().focus().setAudio(fileUrl).run();
        fileUploadState.resetForm();
      }
    }
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

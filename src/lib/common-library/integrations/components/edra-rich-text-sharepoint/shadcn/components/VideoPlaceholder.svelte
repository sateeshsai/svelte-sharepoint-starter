<script lang="ts">
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import type { NodeViewProps } from "@tiptap/core";
  import Video from "@lucide/svelte/icons/video";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { SharePointAsyncSubmitState } from "$lib/common-library/integrations/error-handling";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import MediaPlaceHolder from "$lib/common-library/integrations/components/edra-rich-text/components/MediaPlaceHolder.svelte";
  import { randomIdString } from "$lib/common-library/utils/functions/string";
  import { getContext } from "svelte";
  import { EDRA_FILE_UPLOAD_KEY, type EdraFileUploadContext } from "../../../edra-rich-text/context";

  const { editor }: NodeViewProps = $props();
  const uploadContext = getContext<EdraFileUploadContext | undefined>(EDRA_FILE_UPLOAD_KEY);

  const fileUploadState = new SharePointAsyncSubmitState();

  async function addFile(files: File[]) {
    const file = files?.[0];
    if (!file) {
      fileUploadState.setError("No file selected.");
      return;
    }

    if (!uploadContext) {
      // Fallback: use local blob URL in dev mode, otherwise prompt for URL
      if (LOCAL_MODE) {
        const fileUrl = URL.createObjectURL(file);
        editor.chain().focus().setVideo(fileUrl).run();
      } else {
        handleClick();
      }
      return;
    }

    const result = await uploadContext.upload(file, fileUploadState);

    if ("error" in result) {
      fileUploadState.setError(result.error);
      return;
    }

    editor.chain().focus().setVideo(result.url).run();
    fileUploadState.resetForm();
  }

  function handleClick() {
    const videoUrl = prompt("Please enter the video URL");
    if (videoUrl) {
      editor.chain().focus().setVideo(videoUrl).run();
    }
  }
</script>

<!-- onClick={handleClick} -->
<MediaPlaceHolder class={buttonVariants({ variant: "secondary", class: "my-2 h-full min-h-32 w-full" })} icon={Video} title="Insert a video">
  <div>
    <FileDropZoneWrapper
      elementId={randomIdString()}
      onFileAdd={addFile}
      accept="video/mp4,video/x-m4v,video/*"
      fileType="video"
      maxFiles={1}
      {fileUploadState}
      class="flex h-10 w-full max-w-none grow gap-2 border-none"
    >
      {#snippet icon()}
        <Video />
      {/snippet}
    </FileDropZoneWrapper>
  </div>
</MediaPlaceHolder>

<script lang="ts">
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import type { NodeViewProps } from "@tiptap/core";
  import Video from "@lucide/svelte/icons/video";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { SharePointAsyncSubmitState } from "$lib/common-library/integrations/error-handling";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import MediaPlaceHolder from "$lib/common-library/integrations/components/edra-rich-text/components/MediaPlaceHolder.svelte";
  import { randomIdString } from "$lib/common-library/utils/functions/string";
  // TODO: Decouple this from app-specific config. Use props or context instead.
  // import { sharepointUploadOptions_Story } from "$lib/data/sharepoint-upload-options.svelte";
  import { uploadFile } from "../post.svelte";

  const { editor }: NodeViewProps = $props();

  const fileUploadState = new SharePointAsyncSubmitState();

  async function addFile(files: File[]) {
    await uploadFile(files, fileUploadState);

    if (fileUploadState.success) {
      const file = files?.[0]!;
      const fileUrl = LOCAL_MODE ? URL.createObjectURL(file) : file.name;
      if (fileUrl) {
        editor.chain().focus().setVideo(fileUrl).run();
        fileUploadState.resetForm();
      }
    }
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

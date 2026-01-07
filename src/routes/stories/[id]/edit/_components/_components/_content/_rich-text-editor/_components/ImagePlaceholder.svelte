<script lang="ts">
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import type { NodeViewProps } from "@tiptap/core";
  import Image from "@lucide/svelte/icons/image";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { SharePointAsyncSubmitState } from "$lib/common-library/integrations/error-handling";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import { randomIdString } from "$lib/common-library/utils/functions/string";
  import MediaPlaceHolder from "$lib/common-library/integrations/components/edra-rich-text/components/MediaPlaceHolder.svelte";
  uploadFile;
  // TODO: Decouple this from app-specific config. Use props or context instead.
  // import { sharepointUploadOptions_Story } from "$lib/data/sharepoint-upload-options.svelte";
  import { getContext } from "svelte";
  // import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api";
  import { uploadFile } from "../post.svelte";

  const { editor }: NodeViewProps = $props();

  const fileUploadState = new SharePointAsyncSubmitState();

  async function addFile(files: File[]) {
    await uploadFile(files, fileUploadState);

    if (fileUploadState.success) {
      const file = files?.[0]!;
      const fileUrl = LOCAL_MODE ? URL.createObjectURL(file) : file.name;
      if (fileUrl) {
        editor.chain().focus().setImage({ src: fileUrl }).run();
        fileUploadState.resetForm();
      }
    }
  }

  function handleClick() {
    const imageUrl = prompt("Please enter the image URL");
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  }
</script>

<!-- onClick={handleClick} -->
<MediaPlaceHolder class={buttonVariants({ variant: "secondary", class: "my-2 h-full min-h-32 w-full" })} icon={Image} title="Insert an image">
  <div>
    <FileDropZoneWrapper elementId={randomIdString()} onFileAdd={addFile} accept="image/*" fileType="image" maxFiles={1} class="flex h-10 w-full max-w-none grow gap-2 border-none" {fileUploadState}>
      {#snippet icon()}
        <Image />
      {/snippet}
    </FileDropZoneWrapper>
  </div>
</MediaPlaceHolder>

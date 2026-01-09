<script lang="ts">
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import type { NodeViewProps } from "@tiptap/core";
  import Image from "@lucide/svelte/icons/image";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { AsyncSubmitState, validationError, apiError } from "$lib/common-library/integrations/error-handling";
  import FileDropZoneWrapper from "$lib/common-library/utils/components/file/FileDropZoneWrapper.svelte";
  import { randomIdString } from "$lib/common-library/utils/functions/string";
  import MediaPlaceHolder from "$lib/common-library/integrations/components/edra-rich-text/components/MediaPlaceHolder.svelte";
  import { getContext } from "svelte";
  import { EDRA_FILE_UPLOAD_KEY, type EdraFileUploadContext } from "../../../edra-rich-text/context";

  const { editor }: NodeViewProps = $props();
  const uploadContext = getContext<EdraFileUploadContext | undefined>(EDRA_FILE_UPLOAD_KEY);

  const fileUploadState = new AsyncSubmitState();

  async function addFile(files: File[]) {
    const file = files?.[0];
    if (!file) {
      fileUploadState.setError(validationError({ userMessage: "No file selected", context: "ImagePlaceholder" }));
      return;
    }

    if (!uploadContext) {
      // Fallback: use local blob URL in dev mode, otherwise prompt for URL
      if (LOCAL_MODE) {
        const fileUrl = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: fileUrl }).run();
      } else {
        handleClick();
      }
      return;
    }

    const result = await uploadContext.upload(file, fileUploadState);

    if ("error" in result) {
      fileUploadState.setError(apiError({ userMessage: "Image upload failed", technicalMessage: result.error, context: "ImagePlaceholder" }));
      return;
    }

    editor.chain().focus().setImage({ src: result.url }).run();
    fileUploadState.resetForm();
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

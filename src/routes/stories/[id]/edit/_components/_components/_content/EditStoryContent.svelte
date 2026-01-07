<script lang="ts">
  import type { Content, Editor } from "@tiptap/core";
  import { EdraToolBar, EdraDragHandleExtended, EdraEditor, EDRA_FILE_UPLOAD_KEY, type EdraFileUploadContext } from "$lib/common-library/integrations/components/edra-rich-text/shadcn";
  import { setContext } from "svelte";
  import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
  import { getDataProvider } from "$lib/data/data-providers/provider-factory";

  // Editor states
  let { content = $bindable() }: { content: Content } = $props();
  let editor = $state<Editor>();

  function onUpdate() {
    content = editor?.getHTML() as string;
  }

  // Provide file upload context for the rich text editor placeholders
  setContext<EdraFileUploadContext>(EDRA_FILE_UPLOAD_KEY, {
    upload: async (file: File, state: AsyncSubmitState) => {
      state.setInprogress();

      if (LOCAL_MODE) {
        // In local dev mode, just create a blob URL
        const url = URL.createObjectURL(file);
        state.setSuccess();
        return { url };
      }

      const provider = getDataProvider();
      const response = await provider.readAndUploadFile({
        siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
        listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
        itemId: 0,
        file: file,
        folder: SHAREPOINT_CONFIG.folders.StoryFiles.name,
      });

      if ("error" in response) {
        state.setError("Upload failed: " + response.error);
        return { error: response.error };
      }

      state.setSuccess();
      return { url: file.name };
    },
  });
</script>

<div class="z-50 size-full rounded-md border border-input bg-background">
  {#if editor && !editor.isDestroyed}
    <EdraToolBar class="flex flex-wrap [&_button]:w-auto  [&_button]:grow  items-center lg:overflow-x-auto border-b border-dashed bg-secondary/50 p-0.5" {editor} />
    <EdraDragHandleExtended {editor} />
  {/if}
  <EdraEditor bind:editor {content} class="h-120 max-h-screen overflow-y-scroll pr-2 pl-6 py-4 prose-sm prose-video:mb-0 text-foreground max-w-none" {onUpdate}></EdraEditor>
</div>

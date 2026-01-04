<script lang="ts">
  import type { Content, Editor } from "@tiptap/core";
  import { EdraEditor, EdraToolBar, EdraDragHandleExtended } from "$lib/common-library/integrations/components/edra-rich-text/shadcn";
  // Editor states
  let { content = $bindable() }: { content: Content } = $props();
  // let content = $state<Content>(``);
  let editor = $state<Editor>();
  function onUpdate() {
    content = editor?.getHTML() as string;
  }
</script>

<div class="z-50 size-full rounded-md border border-input bg-background">
  {#if editor && !editor.isDestroyed}
    <EdraToolBar class="flex flex-wrap [&_button]:w-auto  [&_button]:grow  items-center lg:overflow-x-auto border-b border-dashed bg-secondary/50 p-0.5" {editor} />
    <EdraDragHandleExtended {editor} />
  {/if}
  <EdraEditor bind:editor {content} class="h-120 max-h-screen overflow-y-scroll pr-2 pl-6 py-4 prose-sm prose-video:mb-0 text-foreground max-w-none" {onUpdate} />
</div>

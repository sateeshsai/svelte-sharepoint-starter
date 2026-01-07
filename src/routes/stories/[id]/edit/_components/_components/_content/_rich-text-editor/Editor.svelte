<script lang="ts">
  import { getContext, onDestroy, onMount, setContext } from "svelte";
  import initEditor from "$lib/common-library/integrations/components/edra-rich-text/editor";
  import { cn } from "$lib/utils.js";
  import "./_components/editor.css";
  import "./_components/style.css";
  import "./_components/onedark.css";
  import { ImagePlaceholder } from "$lib/common-library/integrations/components/edra-rich-text/extensions/image/ImagePlaceholder.js";
  import ImagePlaceholderComp from "./_components/ImagePlaceholder.svelte";
  import { ImageExtended } from "$lib/common-library/integrations/components/edra-rich-text/extensions/image/ImageExtended.js";
  import ImageExtendedComp from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/ImageExtended.svelte";
  import { VideoPlaceholder } from "$lib/common-library/integrations/components/edra-rich-text/extensions/video/VideoPlaceholder.js";
  import VideoPlaceHolderComp from "./_components/VideoPlaceholder.svelte";
  import { VideoExtended } from "$lib/common-library/integrations/components/edra-rich-text/extensions/video/VideoExtended.js";
  import VideoExtendedComp from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/VideoExtended.svelte";
  import { AudioPlaceholder } from "$lib/common-library/integrations/components/edra-rich-text/extensions/audio/AudioPlaceholder.js";
  import { AudioExtended } from "$lib/common-library/integrations/components/edra-rich-text/extensions/audio/AudiExtended.js";
  import AudioPlaceHolderComp from "./_components/AudioPlaceHolder.svelte";
  import AudioExtendedComp from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/AudioExtended.svelte";
  import { IFramePlaceholder } from "$lib/common-library/integrations/components/edra-rich-text/extensions/iframe/IFramePlaceholder.js";
  import { IFrameExtended } from "$lib/common-library/integrations/components/edra-rich-text/extensions/iframe/IFrameExtended.js";
  import IFramePlaceHolderComp from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/IFramePlaceHolder.svelte";
  import IFrameExtendedComp from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/IFrameExtended.svelte";
  import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
  import { all, createLowlight } from "lowlight";
  import { SvelteNodeViewRenderer } from "svelte-tiptap";
  import CodeBlock from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/CodeBlock.svelte";
  import slashcommand from "$lib/common-library/integrations/components/edra-rich-text/extensions/slash-command/slashcommand.js";
  import SlashCommandList from "$lib/common-library/integrations/components/edra-rich-text/shadcn/components/SlashCommandList.svelte";
  import TableCol from "$lib/common-library/integrations/components/edra-rich-text/shadcn/menus/TableCol.svelte";
  import TableRow from "$lib/common-library/integrations/components/edra-rich-text/shadcn/menus/TableRow.svelte";
  import { focusEditor } from "$lib/common-library/integrations/components/edra-rich-text/utils.js";
  import type { EdraEditorProps } from "$lib/common-library/integrations/components/edra-rich-text/types.js";
  import Link from "$lib/common-library/integrations/components/edra-rich-text/shadcn/menus/Link.svelte";

  const lowlight = createLowlight(all);

  /**
   * Bind the element to the editor
   */
  let element = $state<HTMLElement>();
  let { editor = $bindable(), editable = true, content, onUpdate, autofocus = false, class: className }: EdraEditorProps = $props();

  onMount(() => {
    editor = initEditor(
      element,
      content,
      [
        CodeBlockLowlight.configure({
          lowlight,
        }).extend({
          addNodeView() {
            return SvelteNodeViewRenderer(CodeBlock);
          },
        }),
        ImagePlaceholder(ImagePlaceholderComp),
        ImageExtended(ImageExtendedComp),
        VideoPlaceholder(VideoPlaceHolderComp),
        VideoExtended(VideoExtendedComp),
        AudioPlaceholder(AudioPlaceHolderComp),
        AudioExtended(AudioExtendedComp),
        IFramePlaceholder(IFramePlaceHolderComp),
        IFrameExtended(IFrameExtendedComp),
        slashcommand(SlashCommandList),
      ],
      {
        onUpdate,
        onTransaction(props) {
          editor = undefined;
          editor = props.editor;
        },
        editable,
        autofocus,
      }
    );
  });

  onDestroy(() => {
    if (editor) editor.destroy();
  });
</script>

{#if editor && !editor.isDestroyed}
  <Link {editor} />
  <TableCol {editor} />
  <TableRow {editor} />
{/if}
<div
  bind:this={element}
  role="button"
  tabindex="0"
  onclick={(event) => focusEditor(editor, event)}
  onkeydown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      focusEditor(editor, event);
    }
  }}
  class={cn("edra-editor h-full w-full cursor-auto *:outline-none", className)}
></div>

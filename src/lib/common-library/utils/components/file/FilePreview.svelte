<script lang="ts">
  import { cn } from "$lib/utils";
  import type { FileExtension } from "./file_types";
  import { FILE_TYPES } from "./file_utils";

  const {
    src,
    id,
    class: className,
    options,
  }: {
    src: string;
    id: string;
    class?: string;
    options?: {
      pdf?: { title: string };
      video?: { autoplay?: boolean; loop?: boolean; poster?: string; controls?: boolean };
      image: { alt: string };
      audio?: { autoplay?: boolean; controls?: boolean; loop?: boolean };
    };
  } = $props();

  const DEFAULT_CLASSES = "object-cover h-full w-full my-0!";

  const fileExtn = $derived(src.split(".")[src.split(".").length - 1].toLowerCase());

  const fileTypeDetails = $derived(fileExtn ? FILE_TYPES[fileExtn as FileExtension] : undefined);
</script>

{#if fileTypeDetails}
  {#if fileTypeDetails.preview}
    {#if fileTypeDetails.filetype === "img"}
      <img {id} {src} alt={options?.image.alt} class={cn(DEFAULT_CLASSES, className)} />
    {:else if fileTypeDetails.filetype === "video"}
      <video {id} autoplay={options?.video?.autoplay ?? false} controls={options?.video?.controls ?? true} {src} poster={options?.video?.poster} class={cn(DEFAULT_CLASSES, className)}>
        <track kind="captions" />
      </video>
    {:else if fileTypeDetails.filetype === "audio"}
      <audio
        style:background={fileTypeDetails.color}
        autoplay={options?.audio?.autoplay ?? false}
        controls={options?.audio?.controls ?? true}
        loop={options?.audio?.loop}
        {src}
        class={cn("self-center h-full", DEFAULT_CLASSES, className)}
      ></audio>
    {:else if fileTypeDetails.filetype === "pdf"}
      <iframe title={options?.pdf?.title ?? "PDF Preview"} {src} class={cn(DEFAULT_CLASSES, className, "pointer-events-none")}> </iframe>
    {/if}
  {:else}
    <div style:background={fileTypeDetails.backgroundcolor} style:color={fileTypeDetails.color} class={cn("grid content-center  justify-items-center text-center", DEFAULT_CLASSES, className, "")}>
      <p>{fileTypeDetails.name}</p>
      <p class="uppercase">({fileTypeDetails.extn})</p>
    </div>
  {/if}
{:else}
  <div style:background="hsl(220,10%,50%)" style:color="white" class={cn("grid content-center  justify-items-center text-center", DEFAULT_CLASSES, className, "")}>
    <p>File</p>
    <p class="uppercase">(fileExtn)</p>
  </div>
{/if}

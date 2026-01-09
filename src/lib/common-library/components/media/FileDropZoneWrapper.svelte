<script lang="ts">
  import { FileDropZone } from "$lib/common-library/components/media";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { BaseAsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
  import FileIcon from "@lucide/svelte/icons/file";
  import FilesIcon from "@lucide/svelte/icons/files";
  const {
    elementId,
    onFileAdd,
    maxFiles = 1,
    fileCount = 0,
    accept = "*",
    fileType = "file",
    message = `Drag and drop ${fileType}${maxFiles > 1 ? "s" : ""} here or click to select`,
    class: className,
    icon = defaultIcon,
    fileUploadState = new BaseAsyncSubmitState(),
    children = messageSnippet,
  }: {
    elementId?: string;
    onFileAdd: (files: File[]) => Promise<void>;
    message?: string;
    maxFiles?: number;
    fileCount?: number; //current file count
    accept: string;
    class?: string;
    fileType?: string;
    icon?: Snippet;
    children?: Snippet;
    fileUploadState: BaseAsyncSubmitState;
  } = $props();
</script>

{#snippet defaultIcon()}
  {#if maxFiles > 1}
    <FilesIcon />
  {:else}
    <FileIcon />
  {/if}
{/snippet}

{#snippet messageSnippet()}
  <p class=" ">
    {message}
  </p>
{/snippet}

{#if fileUploadState.initial}
  <FileDropZone
    id={elementId}
    {maxFiles}
    {fileCount}
    onUpload={onFileAdd}
    onFileRejected={(e) => alert(`File '${e.file.name}' was not accepted. Reason: ` + e.reason)}
    {accept}
    class={cn("grid h-full gap-4 rounded-none border-none bg-none text-center text-sm text-muted-foreground bg-muted/30 content-center text-balance", className)}
  >
    {#if icon}
      {@render icon()}
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </FileDropZone>
{:else if fileUploadState.inProgress}
  <StatusMessage type="loading" message="Uploading file..." />
{:else if fileUploadState.success}
  <StatusMessage type="success" message="File is uploaded!" />
{/if}

{#if fileUploadState.message}
  <StatusMessage type="message" message={fileUploadState.message}></StatusMessage>
{/if}

{#if fileUploadState.error}
  <StatusMessage type="error" class="text-destructive" message={fileUploadState.error} />
{/if}

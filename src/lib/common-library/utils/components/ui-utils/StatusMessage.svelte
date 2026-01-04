<script lang="ts">
  import { cn } from "$lib/utils";
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Info from "@lucide/svelte/icons/info";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import type { Snippet } from "svelte";
  const {
    icon = loaderIcon,
    children = messageSnippet,
    type,
    message = "Loading...",
    class: className,
  }: { children?: Snippet; icon?: Snippet; type: "loading" | "success" | "error" | "message"; message: string; class?: string } = $props();
</script>

<div class={cn("statusMessage h-full justify-center gap-2 text-center place-items-center content-center", type === "error" ? "flex text-destructive pb-24" : "grid", className)}>
  {@render icon()}
  {@render children()}
</div>

{#snippet loaderIcon()}
  {#if type === "success"}
    <CircleCheck class=" animate-ping" />
  {:else if type === "error"}
    <CircleX size="20" />
  {:else if type === "message"}
    <Info class="animate-spin" />
  {:else}
    <LoaderCircle class="animate-spin" />
  {/if}
{/snippet}

{#snippet messageSnippet()}
  <p>{message}</p>
{/snippet}

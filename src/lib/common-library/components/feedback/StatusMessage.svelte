<script lang="ts">
  import { cn } from "$lib/utils";
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Info from "@lucide/svelte/icons/info";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
  import { type ErrorReportParams, createErrorReportForUI, type ErrorReportForUI, createMailtoLink } from "$lib/common-library/integrations/error-handling";
  import ErrorReportDialog from "./ErrorReportDialog.svelte";

  const {
    icon = loaderIcon,
    children = messageSnippet,
    type,
    message = "Loading...",
    class: className,
    showReportButton = true,
    errorDetails,
  }: {
    children?: Snippet;
    icon?: Snippet;
    type: "loading" | "success" | "error" | "message";
    message: string;
    class?: string;
    /** Show report button for error type. Defaults to true. */
    showReportButton?: boolean;
    /** Error details for report - provides context and technical info for email report. */
    errorDetails?: ErrorReportParams;
  } = $props();

  const config = getContext<SharePointConfig>("sharePointConfig");

  const errorReport: ErrorReportForUI | null = $derived.by(() => {
    if (type !== "error" || !errorDetails) return null;
    return createErrorReportForUI(errorDetails);
  });

  const errorReportMailtoLink = $derived.by(() => {
    if (type !== "error" || !config?.info?.emails?.support || !errorReport) return "";
    return createMailtoLink(config.info.emails.support, errorReport);
  });
</script>

<div class={cn("statusMessage h-full grid justify-center gap-2 text-center place-items-center content-center", type === "error" ? "gap-1 text-destructive pb-24 text-balance" : "grid", className)}>
  {@render icon()}
  {@render children()}

  {#if type === "error" && showReportButton && errorReport && errorReportMailtoLink}
    <div class="mt-2">
      <ErrorReportDialog {errorReport} mailtoLink={errorReportMailtoLink} />
    </div>
  {/if}
</div>

{#snippet loaderIcon()}
  {#if type === "success"}
    <CircleCheck class=" animate-bounce text-dgreen-500" />
  {:else if type === "error"}
    <CircleX size="20" class="" />
  {:else if type === "message"}
    <Info class="animate-spin" />
  {:else}
    <LoaderCircle class="animate-spin" />
  {/if}
{/snippet}

{#snippet messageSnippet()}
  <p class="shrink my-1!">{message}</p>
{/snippet}

<script lang="ts">
  import { cn } from "$lib/utils";
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Info from "@lucide/svelte/icons/info";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import Copy from "@lucide/svelte/icons/copy";
  import Check from "@lucide/svelte/icons/check";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Popover from "$lib/components/ui/popover";
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
  import { type ErrorReportParams, createErrorReportForUI, type ErrorReportForUI } from "$lib/common-library/integrations/error-handling";

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

  let copied = $state(false);

  const errorReport: ErrorReportForUI | null = $derived.by(() => {
    if (type !== "error" || !errorDetails) return null;
    return createErrorReportForUI(errorDetails);
  });

  const errorReportMailtoLink = $derived.by(() => {
    if (type !== "error" || !config?.info?.emails?.support) return "";

    const support = config.info.emails.support;
    if (!errorReport) return "";

    const body = [
      `Site URL: ${errorReport.siteUrl}`,
      errorReport.context ? `Context: ${errorReport.context}` : "",
      `Error: ${errorReport.userMessage}`,
      errorReport.technicalMessage !== errorReport.userMessage ? `Technical: ${errorReport.technicalMessage}` : "",
      "",
      support.body,
    ]
      .filter(Boolean)
      .join("\n");

    const params = new URLSearchParams();
    params.set("subject", support.subject);
    params.set("body", body);
    if (support.cc.length) params.set("cc", support.cc.join(","));
    if (support.bcc.length) params.set("bcc", support.bcc.join(","));

    return `mailto:${support.email}?${params.toString()}`;
  });

  async function copyAndReport() {
    if (errorReport) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
        copied = true;
        setTimeout(() => (copied = false), 2000);
      } catch {
        // Clipboard access denied, just open mailto
      }
    }
  }
</script>

<div class={cn("statusMessage h-full grid justify-center gap-2 text-center place-items-center content-center", type === "error" ? "gap-1 text-destructive pb-24 text-balance" : "grid", className)}>
  {@render icon()}
  {@render children()}

  {#if type === "error" && showReportButton && errorReportMailtoLink}
    <Popover.Root>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button size="sm" variant="outline" {...props} class="mt-2">More Info</Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-80">
        <div class="grid gap-3">
          <h4 class="font-medium text-sm text-foreground">Error Details</h4>
          <div class="text-xs text-left space-y-1 text-muted-foreground">
            {#if errorReport?.context}
              <p><span class="font-medium">Context:</span> {errorReport.context}</p>
            {/if}
            <p><span class="font-medium">Error:</span> {errorReport?.userMessage}</p>
            {#if errorReport?.technicalMessage && errorReport.technicalMessage !== errorReport.userMessage}
              <p class="break-all"><span class="font-medium">Technical:</span> {errorReport.technicalMessage}</p>
            {/if}
            <p><span class="font-medium">Type:</span> {errorReport?.errorType}</p>
            <p class="break-all"><span class="font-medium">URL:</span> {errorReport?.siteUrl}</p>
          </div>
          <Button size="sm" variant="destructive" href={errorReportMailtoLink} onclick={copyAndReport} class="w-full">
            {#if copied}
              <Check class="size-4 mr-1" /> Copied & Opening Email
            {:else}
              <Copy class="size-4 mr-1" /> Report (Copy & Email)
            {/if}
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
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

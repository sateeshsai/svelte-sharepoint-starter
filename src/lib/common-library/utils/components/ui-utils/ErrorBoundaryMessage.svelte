<script lang="ts">
  import { reportError } from "$lib/common-library/integrations/error-handling/error-api";
  import { boundaryError, createErrorReportForUI, type ErrorReportForUI } from "$lib/common-library/integrations/error-handling";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Popover from "$lib/components/ui/popover";
  import { cn } from "$lib/utils";
  import Copy from "@lucide/svelte/icons/copy";
  import Check from "@lucide/svelte/icons/check";
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";

  let {
    error,
    reset,
    class: className,
    messageSnippet = defaultMessageSnippet,
    showReportButton = true,
    customError,
  }: {
    error: string | Error | null;
    reset: () => void;
    class?: string;
    messageSnippet?: Snippet;
    showReportButton?: boolean;
    customError: string;
  } = $props();

  const errorString = $derived(typeof error === "string" ? error : error instanceof Error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : "Unknown boundary error.");

  const config = getContext<SharePointConfig>("sharePointConfig");

  let copied = $state(false);

  const errorParams = $derived(boundaryError({ userMessage: customError, technicalMessage: errorString, context: "ErrorBoundary" }));
  const errorReport: ErrorReportForUI = $derived(createErrorReportForUI(errorParams));

  $effect(() => {
    if (error) {
      reportError(config, errorParams).catch(() => {});
    }
  });

  const errorReportMailtoLink = $derived.by(() => {
    if (!config?.info?.emails?.support) return "";

    const support = config.info.emails.support;

    const body = [`Site URL: ${errorReport.siteUrl}`, `Context: ${errorReport.context}`, `Error: ${errorReport.userMessage}`, `Technical: ${errorReport.technicalMessage}`, "", support.body]
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
    try {
      await navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Clipboard access denied, just open mailto
    }
  }
</script>

<div class={cn("ErrorBoundaryMessage px-2 grid h-full justify-center gap-1 text-center place-items-center content-center pb-12", className)}>
  {@render messageSnippet()}
  <div class="flex justify-center gap-2">
    <Button
      size="sm"
      onclick={() => {
        reset();
      }}>Reload</Button
    >
    {#if showReportButton && errorReportMailtoLink}
      <Popover.Root>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button size="sm" variant="outline" {...props}>More Info</Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-80">
          <div class="grid gap-3">
            <h4 class="font-medium text-sm text-foreground">Error Details</h4>
            <div class="text-xs text-left space-y-1 text-muted-foreground">
              <p><span class="font-medium">Context:</span> {errorReport.context}</p>
              <p><span class="font-medium">Error:</span> {errorReport.userMessage}</p>
              <p class="break-all"><span class="font-medium">Technical:</span> {errorReport.technicalMessage}</p>
              <p><span class="font-medium">Type:</span> {errorReport.errorType}</p>
              <p class="break-all"><span class="font-medium">URL:</span> {errorReport.siteUrl}</p>
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
</div>

{#snippet defaultMessageSnippet()}
  <h2 class="text-destructive mb-2">An error occured.</h2>
  <p class="mb-2">{customError}</p>
{/snippet}

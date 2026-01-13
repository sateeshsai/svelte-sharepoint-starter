<script lang="ts">
  import { reportError } from "$lib/common-library/integrations/error-handling/error-api";
  import { boundaryError, createErrorReportForUI, createMailtoLink, type ErrorReportForUI } from "$lib/common-library/integrations/error-handling";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
  import ErrorReportDialog from "./ErrorReportDialog.svelte";

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

  console.log(error);

  const errorString = $derived(typeof error === "string" ? error : error instanceof Error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : "Unknown boundary error.");

  const config = getContext<SharePointConfig>("sharePointConfig");

  const errorParams = $derived(boundaryError({ userMessage: customError, technicalMessage: errorString, context: "Render error" }));
  const errorReport: ErrorReportForUI = $derived(createErrorReportForUI(errorParams));

  $effect(() => {
    if (error) {
      reportError(config, errorParams).catch(() => {});
    }
  });

  const errorReportMailtoLink = $derived.by(() => {
    if (!config?.info?.emails?.support) return "";
    return createMailtoLink(config.info.emails.support, errorReport);
  });
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
      <ErrorReportDialog {errorReport} mailtoLink={errorReportMailtoLink} />
    {/if}
  </div>
</div>

{#snippet defaultMessageSnippet()}
  <h2 class="text-destructive mb-2">An error occured.</h2>
  <p class="mb-2">{customError}</p>
{/snippet}

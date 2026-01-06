<script lang="ts">
  import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
  import { reportError } from "$lib/common-library/integrations/error-handling/report-error";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";

  let {
    error,
    reset,
    class: className,
    messageSnippet = defaultMessageSnippet,
    reportSnippet = defaultReportSnippet,
    showReportSnippet = true,
    actionSnippet = defaultActionSnippet,
    customError,
  }: {
    error: string | Record<string, any> | null;
    reset: () => void;
    class?: string;
    messageSnippet?: Snippet;
    reportSnippet?: Snippet;
    actionSnippet?: Snippet;
    showReportSnippet?: boolean;
    customError: string;
  } = $props();

  const errorString = $derived(typeof error === "string" ? error : typeof error === "object" ? JSON.stringify(error) : "Unknown boundary error.");

  const config = getContext<SharePointConfig>("sharePointConfig");

  $effect(() => {
    if (error) {
      reportError(config, {
        context: "ErrorBoundary",
        errorType: "render",
        technicalMessage: errorString,
        userMessage: customError,
      }).catch(() => {});
    }
  });

  const errorReportEmail_Mailto_Link = $derived(
    "mailto:" +
      config.info.emails.support.email +
      "?subject=" +
      config.info.emails.support.subject +
      "&body=" +
      "Site URL: " +
      window.location.href +
      "%0D%0A%0D%0A" + //%0D%0A is a line break in the body of the email
      "Error message:%0D%0A" +
      +customError +
      "%0D%0A" +
      errorString +
      config.info.emails.support.body +
      ((config.info.emails.support.cc.length ? "&cc=" + config.info.emails.support.cc.join(",") : "") +
        (config.info.emails.support.bcc.length ? "&bcc=" + config.info.emails.support.bcc.join(",") : ""))
  );
</script>

<div class={cn("ErrorBoundaryMessage grid h-full justify-center gap-2 text-center place-items-center content-center pb-12", className)}>
  {@render messageSnippet()}
  {#if showReportSnippet}
    {@render reportSnippet()}
  {/if}
  {@render actionSnippet()}
</div>

{#snippet defaultMessageSnippet()}
  <h2 class="text-destructive mb-2">An error occured.</h2>
  <p class="mb-2">Error message: {customError}</p>
  <p class="mb-2">Error message: {errorString}</p>
{/snippet}

{#snippet defaultReportSnippet()}
  <Button size="sm" variant="secondary" href={errorReportEmail_Mailto_Link} class="mb-2">Report this error</Button>
{/snippet}
{#snippet defaultActionSnippet()}
  <Button
    size="sm"
    onclick={() => {
      reset();
    }}
    class="">Try reloading</Button
  >
{/snippet}

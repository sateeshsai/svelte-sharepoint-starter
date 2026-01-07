<script lang="ts">
  import { reportError } from "$lib/common-library/integrations/error-handling/report-error";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
  import { route } from "sv-router/generated";

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
    error: string | Error | null;
    reset: () => void;
    class?: string;
    messageSnippet?: Snippet;
    reportSnippet?: Snippet;
    actionSnippet?: Snippet;
    showReportSnippet?: boolean;
    customError: string;
  } = $props();

  const errorString = $derived(typeof error === "string" ? error : error instanceof Error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : "Unknown boundary error.");
  const errorMessage = $derived(typeof error === "string" ? error : error instanceof Error ? error.message : "Unknown boundary error.");

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
      `Error message: ${customError}` +
      "%0D%0A" +
      errorString +
      config.info.emails.support.body +
      ((config.info.emails.support.cc.length ? "&cc=" + config.info.emails.support.cc.join(",") : "") +
        (config.info.emails.support.bcc.length ? "&bcc=" + config.info.emails.support.bcc.join(",") : ""))
  );
</script>

<div class={cn("ErrorBoundaryMessage px-2 grid h-full justify-center gap-1 text-center place-items-center content-center pb-12", className)}>
  {@render messageSnippet()}
  <div class="flex justify-center gap-2">
    {#if showReportSnippet}
      {@render reportSnippet()}
    {/if}
    {@render actionSnippet()}
  </div>
</div>

{#snippet defaultMessageSnippet()}
  <h2 class="text-destructive mb-2">An error occured.</h2>
  <p class="mb-2">{customError}</p>
  <p class="mb-2 text-muted-foreground text-balance text-sm max-w-[50ch]">Error message: {errorString}</p>
{/snippet}

{#snippet defaultReportSnippet()}
  <Button size="sm" variant="destructive" href={errorReportEmail_Mailto_Link} class="mb-2">Report</Button>
{/snippet}
{#snippet defaultActionSnippet()}
  <Button
    size="sm"
    onclick={() => {
      reset();
    }}
    class="">Reload</Button
  >
{/snippet}

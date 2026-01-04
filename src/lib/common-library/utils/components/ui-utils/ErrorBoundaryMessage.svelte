<script lang="ts">
  import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/const";
  import Button from "$lib/components/ui/button/button.svelte";
  import { SHAREPOINT_ENV } from "$lib/env/env";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  let {
    error,
    reset,
    class: className,
    messageSnippet = defaultMessageSnippet,
    reportSnippet = defaultReportSnippet,
    showReportSnippet = true,
    actionSnippet = defaultActionSnippet,
  }: {
    error: string | Record<string, any> | null;
    reset: () => void;
    class?: string;
    messageSnippet?: Snippet;
    reportSnippet?: Snippet;
    actionSnippet?: Snippet;
    showReportSnippet?: boolean;
  } = $props();

  const errorString = $derived(typeof error === "string" ? error : typeof error === "object" ? JSON.stringify(error) : "Unknown boundary error.");

  const errorReportEmail_Mailto_Link = $derived(
    "mailto:" +
      SHAREPOINT_ENV.info.emails.support.email +
      "?subject=" +
      SHAREPOINT_ENV.info.emails.support.subject +
      "&body=" +
      "Site URL: " +
      window.location.href +
      "%0D%0A%0D%0A" + //%0D%0A is a line break in the body of the email
      "Error message:%0D%0A" +
      error +
      SHAREPOINT_ENV.info.emails.support.body +
      ((SHAREPOINT_ENV.info.emails.support.cc.length ? "&cc=" + SHAREPOINT_ENV.info.emails.support.cc.join(",") : "") +
        (SHAREPOINT_ENV.info.emails.support.bcc.length ? "&bcc=" + SHAREPOINT_ENV.info.emails.support.bcc.join(",") : ""))
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
  <p class="mb-2">Error error: {error}</p>
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

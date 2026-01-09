<!--
  @component ErrorReportDialog
  Shared dialog for displaying error details with copy and email report functionality.
  Used by StatusMessage and ErrorBoundaryMessage. Shows error context, messages, type, and URL.
-->
<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Copy from "@lucide/svelte/icons/copy";
  import Check from "@lucide/svelte/icons/check";
  import Mail from "@lucide/svelte/icons/mail";
  import type { ErrorReportForUI } from "$lib/common-library/integrations/error-handling";
  import { toast } from "svelte-sonner";

  const {
    errorReport,
    mailtoLink,
  }: {
    /** Full error report object with context, messages, type, URL, timestamp */
    errorReport: ErrorReportForUI;
    /** Pre-built mailto: link with error details in body */
    mailtoLink: string;
  } = $props();

  let copied = $state(false);

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
      copied = true;
      toast.success("Error details copied to clipboard");
      setTimeout(() => (copied = false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>More Info</Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>Error Report</Dialog.Title>
      <Dialog.Description>Details about the error that occurred.</Dialog.Description>
    </Dialog.Header>
    <dl class="text-sm space-y-2 text-muted-foreground">
      {#if errorReport.context}
        <div class="flex gap-2">
          <dt class="font-medium text-foreground shrink-0 w-20">Context</dt>
          <dd>{errorReport.context}</dd>
        </div>
      {/if}
      <div class="flex gap-2">
        <dt class="font-medium text-foreground shrink-0 w-20">Error</dt>
        <dd>{errorReport.userMessage}</dd>
      </div>
      {#if errorReport.technicalMessage !== errorReport.userMessage}
        <div class="flex gap-2">
          <dt class="font-medium text-foreground shrink-0 w-20">Technical</dt>
          <dd class="break-all">{errorReport.technicalMessage}</dd>
        </div>
      {/if}
      <div class="flex gap-2">
        <dt class="font-medium text-foreground shrink-0 w-20">Type</dt>
        <dd>{errorReport.errorType}</dd>
      </div>
      <div class="flex gap-2">
        <dt class="font-medium text-foreground shrink-0 w-20">URL</dt>
        <dd class="break-all">{errorReport.siteUrl}</dd>
      </div>
    </dl>
    <Dialog.Footer class="flex-col sm:flex-row gap-2">
      <Button size="sm" variant="outline" onclick={copyDetails} class="w-full sm:w-auto">
        {#if copied}
          <Check class="size-4" /> Copied
        {:else}
          <Copy class="size-4" /> Copy Details
        {/if}
      </Button>
      <Button size="sm" variant="destructive" href={mailtoLink} class="w-full sm:w-auto">
        <Mail class="size-4" /> Send Report
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

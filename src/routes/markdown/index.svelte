<script lang="ts">
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";
  import { cn } from "$lib/utils";
  import ComponentsInMarkdown from "./_components-in-markdown.md";
  import SimpleMarkdown from "./_components-in-markdown.md";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
</script>

<main class={cn("prose-sm sm:prose  mx-auto dark:prose-invert", PAGE_UTIL_CLASSES.padding, PAGE_UTIL_CLASSES.maxWidth)}>
  <svelte:boundary>
    {#snippet failed(error: any, reset)}
      <ErrorBoundaryMessage customError="Error rendering Markdown samples page." {error} {reset} />
    {/snippet}

    <h1>Simple Markdown</h1>
    <SimpleMarkdown />

    <h1>Components in Markdown</h1>
    <ComponentsInMarkdown />
  </svelte:boundary>
</main>

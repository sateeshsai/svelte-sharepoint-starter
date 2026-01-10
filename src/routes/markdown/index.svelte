<script lang="ts">
  import ComponentsInMarkdown from "./_components-in-markdown.md";
  import SimpleMarkdown from "./_components-in-markdown.md";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { Section, Prose } from "$lib/common-library/components/layout";
  import { HEADING_CLASSES } from "$lib/common-library/utils";
</script>

<Section as="main">
  <Prose>
    <svelte:boundary>
      {#snippet failed(error: any, reset)}
        <ErrorBoundaryMessage customError="Error rendering Markdown samples page." {error} {reset} />
      {/snippet}

      <h1 class={HEADING_CLASSES.page}>Simple Markdown</h1>
      <SimpleMarkdown />

      <h1 class={HEADING_CLASSES.page}>Components in Markdown</h1>
      <ComponentsInMarkdown />
    </svelte:boundary>
  </Prose>
</Section>

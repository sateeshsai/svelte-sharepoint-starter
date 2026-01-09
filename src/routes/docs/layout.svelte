<script lang="ts">
  import { setContext } from "svelte";
  import { cn } from "$lib/utils";
  import { p } from "sv-router/generated";
  import { getDocs, type DocSection } from "$lib/data/items/docs";
  import Input from "$lib/components/ui/input/input.svelte";
  import { AsyncLoadState } from "$lib/common-library/integrations/error-handling";
  import type { Snippet } from "svelte";
  import { PAGE_UTIL_CLASSES } from "$lib/common-library/utils/const/classes";

  const { children }: { children: Snippet } = $props();
  let searchQuery = $state("");
  let sections: DocSection[] = $state([]);
  const docsLoadState = new AsyncLoadState();

  // Expose sections via context for child routes
  setContext<() => DocSection[]>("getDocSections", () => sections);

  async function loadDocs() {
    const docsFromMdFiles = await getDocs(docsLoadState);
    if (docsFromMdFiles) sections = docsFromMdFiles;
  }

  $effect(() => {
    loadDocs();
  });

  // Filter sections based on search query
  const filteredSections = $derived.by(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((section) => section.label.toLowerCase().includes(query) || section.description.toLowerCase().includes(query) || section.keywords.some((kw) => kw.includes(query)));
  });
</script>

<div class={cn("flex min-h-screen bg-muted/30", PAGE_UTIL_CLASSES.maxWidth)}>
  <!-- Sidebar -->
  <aside class="w-64 border-r bg-white dark:bg-slate-950 sticky top-0 h-screen overflow-y-auto">
    <div class="p-6 py-8">
      <h1 class="text-xl font-bold mb-6">Documentation</h1>

      <!-- Search -->
      <div class="mb-6">
        <Input type="search" placeholder="Search docs..." bind:value={searchQuery} class="" />
        {#if searchQuery.trim()}
          <p class="text-xs text-gray-500 mt-2">Found {filteredSections.length} of {sections.length}</p>
        {/if}
      </div>

      <!-- Navigation -->
      <nav class="space-y-1">
        {#if docsLoadState.loading}
          <p class="text-xs text-gray-500">Loading docs...</p>
        {:else if docsLoadState.error}
          <p class="text-xs text-red-500">{docsLoadState.error}</p>
        {:else}
          {#each filteredSections as section}
            <a
              href={section.id === "overview" ? p("/docs") : p("/docs/:section", { params: { section: section.id } })}
              class={cn("block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors", "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800")}
            >
              <div class="font-medium">{section.label}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{section.description}</div>
            </a>
          {/each}
          {#if searchQuery.trim() && filteredSections.length === 0}
            <p class="text-xs text-gray-500 p-4">No matching documentation found.</p>
          {/if}
        {/if}
      </nav>
    </div>
  </aside>

  <!-- Main Content -->
  <main class={cn("flex-1 overflow-y-auto", PAGE_UTIL_CLASSES.padding)}>
    {@render children()}
  </main>
</div>

<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { navigating } from "$lib/common-library/integrations/router/router-helpers.svelte";
  import type { Snippet } from "svelte";
  import { p } from "sv-router/generated";
  import AppSidebar from "./_components/AppSidebar.svelte";

  let { children }: { children: Snippet } = $props();
</script>

{#if navigating.afterload}
  <Sidebar.Provider class="min-h-none">
    <AppSidebar />
    <Sidebar.Inset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Sidebar.Trigger class="-ms-1" />
        <Separator orientation="vertical" class="me-2 h-4" />
        <h1 class="text-lg">Admin dashboard</h1>
      </header>

      {@render children()}
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}

<script lang="ts">
  import { Router } from "sv-router";
  import { cn } from "$lib/utils";
  import { navigating } from "$lib/common-library/integrations/router/router-helpers.svelte";
  import { onMount, setContext } from "svelte";
  import { ModeWatcher } from "mode-watcher";
  import { getAndStoreCurrentUserInfo } from "$lib/data/items/users";
  import { Toaster } from "svelte-sonner";
  import { createLoadState, initAsyncStateContext } from "$lib/data/async-state.svelte";
  import { initEngagementContext } from "$lib/common-library/integrations/components/engagements";
  import { currentUserId } from "$lib/data/global-state.svelte";
  import Head from "$lib/common-library/integrations/pwa/Head.svelte";
  import Header from "./_components/Header.svelte";
  import Footer from "./_components/Footer.svelte";
  import TailwindViewportHelper from "$lib/common-library/components/dev/TailwindViewportHelper.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import ConfigErrorBoundary from "./_components/ConfigErrorBoundary.svelte";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import { SHAREPOINT_PATHS } from "$lib/env/sharepoint-paths";
  import { SECTION_CLASSES } from "$lib/common-library/utils";
  import { initCacheDatabase } from "$lib/common-library/utils/cache";

  // Provide config to all child components via Svelte context
  setContext("sharePointConfig", SHAREPOINT_CONFIG);

  // Provide async state factory to common-library components
  initAsyncStateContext();

  // Provide user info to engagement components (library isolation pattern)
  initEngagementContext({ getCurrentUserId: currentUserId });

  // Initialize IndexedDB cache with app + site-specific prefix to prevent data leakage
  // Format: {shortname}_{siteCollection} - unique per project AND per SharePoint site
  const siteCollection = SHAREPOINT_PATHS.site_collection.split("/").pop() || "local";
  const cachePrefix = `${SHAREPOINT_CONFIG.shortname}_${siteCollection}`;
  initCacheDatabase(cachePrefix);

  onMount(() => {
    loadData();
  });

  let initialDataLoadState = createLoadState();

  async function loadData() {
    await getAndStoreCurrentUserInfo(initialDataLoadState);
  }
</script>

<!-- <ConfigErrorBoundary> -->
<div class={cn("fixed  top-0 left-0  h-1 w-full origin-left bg-dgreen-bright transition-discrete duration-1000", navigating.beforeload ? " scale-x-100" : "scale-x-0 ")}></div>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <div class="min-h-screen grid content-center px-24">
      <ErrorBoundaryMessage customError="Error rendering site." {error} {reset} />
    </div>
  {/snippet}
  <!-- MOSTLY META AND UTIL UI ELEMENTS -->
  <ModeWatcher />
  <!-- <TailwindViewportHelper /> -->
  <Head />
  <Toaster richColors closeButton position="top-right" />

  <!-- PAGE -->
  <div class={cn("grainy-gradient fixed top-0 left-[50%] w-full h-full -z-10 translate-x-[-50%]", SECTION_CLASSES.appShell)}></div>
  <div class={cn("min-h-screen grid", SECTION_CLASSES.appShell)}>
    {#if initialDataLoadState?.loading}
      <StatusMessage type="loading" message="Loading..." />
    {:else if initialDataLoadState?.ready}
      <div class="innerBody grid grid-rows-[auto_1fr_auto] h-full">
        <Header />
        <Router base="#" />
        <Footer />
      </div>
    {/if}

    {#if initialDataLoadState?.error}
      <StatusMessage type="error" message={initialDataLoadState.error} errorDetails={initialDataLoadState.errorDetails} />
    {/if}
  </div>
</svelte:boundary>

<!-- </ConfigErrorBoundary> -->

<style>
  :global(.dark .grainy-gradient) {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 896 896' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.99' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
      radial-gradient(circle at 0% 99%, hsla(0, 0%, 0%, 0.41) 0%, transparent 67%), radial-gradient(circle at 46% 94%, rgb(17, 17, 20) 0%, transparent 81%),
      radial-gradient(circle at 89% 8%, rgb(13, 12, 14) 0%, transparent 150%), radial-gradient(circle at 89% 8%, hsla(218, 100%, 9%, 1) 0%, transparent 150%);
    background-blend-mode: overlay, normal, normal, normal, normal, normal, normal, normal;
  }
</style>

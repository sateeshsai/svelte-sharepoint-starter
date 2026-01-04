<script lang="ts">
  import { Router } from "sv-router";
  import { cn } from "$lib/utils";
  import { navigating } from "$lib/common-library/router/router-helpers.svelte";
  import { onMount } from "svelte";
  import { ModeWatcher } from "mode-watcher";
  import { getAndStoreCurrentUserInfo } from "./get.svelte";
  import { Toaster } from "svelte-sonner";
  import { AsyncLoadState } from "$lib/common-library/functions/async.svelte";
  import Head from "$lib/common-library/pwa/Head.svelte";
  import Header from "./_components/Header.svelte";
  import Footer from "./_components/Footer.svelte";
  import TailwindViewportHelper from "$lib/common-library/components/ui-utils/TailwindViewportHelper.svelte";
  import StatusMessage from "$lib/common-library/components/ui-utils/StatusMessage.svelte";

  onMount(() => {
    loadData();
  });

  let initialDataLoadState = new AsyncLoadState<true>();

  async function loadData() {
    await getAndStoreCurrentUserInfo(initialDataLoadState);
  }
</script>

<div class={cn("fixed  top-0 left-0  h-1 w-full origin-left bg-dgreen-bright transition-discrete duration-1000", navigating.beforeload ? " scale-x-100" : "scale-x-0 ")}></div>
<ModeWatcher />
<TailwindViewportHelper />
<Head />
<Toaster position="top-right" />
<div class="grainy-gradient fixed top-0 left-[50%] w-full h-full -z-10 max-w-screen-4xl translate-x-[-50%]"></div>

<div class="min-h-screen grid max-w-screen-4xl mx-auto">
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
    <StatusMessage type="error" message={initialDataLoadState.error} />
  {/if}
</div>

<style>
  :global(.dark .grainy-gradient) {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 896 896' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.99' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
      radial-gradient(circle at 0% 99%, hsla(0, 0%, 0%, 0.41) 0%, transparent 67%), radial-gradient(circle at 46% 94%, rgb(17, 17, 20) 0%, transparent 81%),
      radial-gradient(circle at 89% 8%, rgb(13, 12, 14) 0%, transparent 150%), radial-gradient(circle at 89% 8%, hsla(218, 100%, 9%, 1) 0%, transparent 150%);
    background-blend-mode: overlay, normal, normal, normal, normal, normal, normal, normal;
  }
</style>

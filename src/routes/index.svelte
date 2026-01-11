<script lang="ts">
  import Carousel_Stories from "./_components/Carousel_Stories.svelte";
  import { getUserFirstLastNames } from "$lib/common-library/integrations/sharepoint-rest-api/utilities/helpers";
  import { cn } from "$lib/utils";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { global_State } from "$lib/data/global-state.svelte";
  import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { FRAMEWORK_FEATURES_SIMPLE } from "./data";
  import { fade, fly, scale, slide } from "svelte/transition";
  import { IsInViewport } from "runed";
  import { trackAnalytics } from "$lib/common-library/integrations/analytics/analytics";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";
  import { getContext } from "svelte";
  import { Section } from "$lib/common-library/components/layout";
  import { SECTION_CLASSES, HEADING_CLASSES } from "$lib/common-library/utils";

  let targetNode = $state<HTMLElement>()!;
  const inViewport = new IsInViewport(() => targetNode);

  trackAnalytics();
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering home page." {error} {reset} />
  {/snippet}
  <main class={cn("grid content-start justify-items-center")}>
    <div class="w-full bg-no-repeat bg-bottom bg-size-[210%] md:bg-size-[180%] lg:bg-size-[130%] xl:bg-size-[100%]" style="background-image:url(./assets/images/svelte-machine.avif);">
      <Section class="w-full text-balance grid ">
        <div class={cn("hero", SECTION_CLASSES.padding.standard, SECTION_CLASSES.maxWidth.standard)}>
          {#if global_State.userProperties}
            <p in:fly={{ x: -20 }} class="mb-10">Welcome, {getUserFirstLastNames(global_State.userProperties).first}!</p>
          {:else}
            <p>
              <LoaderCircle class="mb-10 animate-spin" />
            </p>
          {/if}
          <h1 class={cn(HEADING_CLASSES.hero, "mb-10")} in:slide|global>
            <span class="text-[#f96743]">Svelte</span> <span class="text-muted-foreground">+</span> <span class="text-dblue-300">SharePoint</span>
          </h1>
          <p in:fade|global={{ delay: 200 }} class="leading-relaxed max-w-[30ch] lg:max-w-[50ch] 2xl:text-lg mb-48 lg:mb-56">
            A meta-framework to accelerate and standardize web development projects.
          </p>
        </div>
      </Section>
    </div>

    <Separator class="bg-muted" />

    <div class=" bg-muted/80 dark:bg-muted/30 w-full">
      <Section bind:node={targetNode} class={cn(SECTION_CLASSES.gap.md, "relative overflow-hidden grid lg:grid-cols-2")}>
        <div class="videoWrapper overflow-hidden grid rounded-lg" in:scale|global={{ start: 0 }}>
          <video muted autoplay src="./assets/videos/Batteries_941611483.mp4" class="h-full w-full col-start-1 row-start-1 object-cover">
            <track kind="captions" />
          </video>
          <div class="overlay col-start-1 row-start-1 w-full h-full bg-linear-to-r from-white/90 dark:from-black/80 from-40% dark:from-30% to-transparent p-8 grid content-center">
            <h2 class={cn(HEADING_CLASSES.section, "text-3xl lg:text-5xl mb-6 text-dblue-500 dark:text-dblue-bright max-w-2/3")} in:slide|global={{ axis: "x", delay: 300 }}>Batteries-included!</h2>
            <p class="leading-relaxed 2xl:text-lg max-w-1/2 text-balance" in:fade|global={{ delay: 400 }}>Everything you would need to start a new project in minutes</p>
          </div>
        </div>

        {#if inViewport.current}
          <ul class="list-disc ml-4 space-y-1.5 text-pretty text-muted-foreground lg:py-6">
            {#each FRAMEWORK_FEATURES_SIMPLE as benefit, idx}
              <li in:fly|global={{ y: -10, delay: 200 + idx * 100 }}>{benefit}</li>
            {/each}
          </ul>
        {/if}
      </Section>
    </div>
    <Separator class="bg-muted" />

    <section class="carousel my-8 lg:my-12 w-full">
      <div class={cn("carouselHeader font-light text-2xl grid w-full", "pt-0 pb-6")}>
        <h3 class="text-center">Carousel sample</h3>
      </div>
      <Carousel_Stories />
    </section>
  </main>
</svelte:boundary>

<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  import { cn } from "$lib/utils";
  import Autoplay from "embla-carousel-autoplay";
  import type { Story_ListItem } from "$lib/data/types";
  import { getStories } from "$routes/stories/get.svelte";
  import StatusMessage from "$lib/common-library/utils/components/ui-utils/StatusMessage.svelte";
  import { p } from "sv-router/generated";
  import { SharePointAsyncLoadState } from "$lib/common-library/integrations/error-handling";
  import ErrorBoundaryMessage from "$lib/common-library/utils/components/ui-utils/ErrorBoundaryMessage.svelte";

  let api = $state<CarouselAPI>();

  let autoPlayDelay = 5000;
  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);

  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;
      api.on("select", () => {
        current = api!.selectedScrollSnap() + 1;
      });
    }
  });

  const plugin = Autoplay({ delay: autoPlayDelay, stopOnInteraction: true });

  let storiesLoadState = new SharePointAsyncLoadState();
  let stories: Story_ListItem[] | undefined = $state();

  async function loadStories() {
    stories = await getStories(storiesLoadState);
  }

  $effect(() => {
    loadStories();
  });
</script>

<svelte:boundary>
  {#snippet failed(error: any, reset)}
    <ErrorBoundaryMessage customError="Error rendering home page carousel." {error} {reset} />
  {/snippet}
  {#if storiesLoadState.loading}
    <StatusMessage type="loading" message="Loading carousel..." />
  {:else if storiesLoadState.ready && stories}
    <Carousel.Root
      opts={{
        loop: true,
      }}
      plugins={[plugin]}
      setApi={(emblaApi) => (api = emblaApi)}
      onmouseenter={plugin.stop}
      onmouseleave={plugin.reset}
      class="relative max-w-[100vw] overflow-hidden sm:w-full sm:max-w-none"
      orientation="horizontal"
    >
      <Carousel.Content>
        {#each stories as story, idx (story.Id)}
          <Carousel.Item class="basis-3/4 sm:basis-2/3 xl:basis-1/3">
            <Card.Root class="py-0 overflow-hidden">
              <Card.Content class="p-0">
                <!-- <span class="text-4xl font-semibold">{i + 1}</span> -->
                <a href={p("/stories/:id", { params: { id: String(story.Id) } })} class="bg-cover grid content-end h-96" style="background-image:url(./assets/StoryFiles/{story.CoverFileName})">
                  <p class="pt-12 bg-linear-to-b from-transparent to-black/60 flex flex-col items-center justify-end p-6 text-lg font-bold text-white">{story.Title}</p>
                </a>
              </Card.Content>
            </Card.Root>
          </Carousel.Item>
        {/each}
      </Carousel.Content>
      <Carousel.Previous class="hidden  sm:block" />
      <Carousel.Next class="hidden sm:block" />
    </Carousel.Root>
    <div class="mt-4 flex justify-center gap-2">
      {#each Array(count) as _, i (i)}
        <button onclick={() => api?.scrollTo(i)} class={cn("h-3 w-3 rounded-full", current === i + 1 ? "bg-muted-foreground" : "bg-muted")} title={"" + i + 1}></button>
      {/each}
    </div>
    <div class="mt-4 text-center text-xs text-muted-foreground">
      Slide {current} of {count}
    </div>
  {:else if storiesLoadState.error}
    <StatusMessage type="error" message={storiesLoadState.error} />
  {/if}
</svelte:boundary>

<script lang="ts" module>
  /**
   * Item structure for MediaGallery component.
   * Flexible interface that works with any media item that has an id, filename, and optional description.
   */
  export interface MediaGalleryItem {
    /** Unique identifier for the media item */
    id: string | number;
    /** Filename or title for the media */
    filename: string;
    /** Optional description/caption shown below media */
    description?: string;
  }
</script>

<script lang="ts">
  import { IsInViewport } from "runed";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import FilePreview from "$lib/common-library/components/media/FilePreview.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import { fly } from "svelte/transition";
  import ErrorBoundaryMessage from "$lib/common-library/components/feedback/ErrorBoundaryMessage.svelte";

  interface Props {
    /** Array of media items to display in the gallery */
    items: MediaGalleryItem[];
    /** Base path to media folder (prepended to filenames) */
    basePath: string;
    /** Optional CSS class for gallery container */
    class?: string;
  }

  const { items, basePath, class: className }: Props = $props();

  let activeItemIdx: number = $state(0);

  function setActiveItem(direction: "prev" | "next") {
    activeItemIdx = direction === "prev" ? activeItemIdx - 1 : activeItemIdx + 1;
  }

  let galleryEl = $state<HTMLElement>()!;
  const inViewport = new IsInViewport(() => galleryEl);
</script>

<section bind:this={galleryEl} id="gallery" class={cn("gallery grid md:grid-cols-2 xl:grid-cols-3 gap-5", className)}>
  {#if inViewport.current}
    <svelte:boundary>
      {#snippet failed(error: any, reset)}
        <ErrorBoundaryMessage customError="Error rendering media gallery." {error} {reset} />
      {/snippet}
      {#each items as item, idx (item.id)}
        {@const activeItem = items[activeItemIdx]}
        <figure in:fly|global={{ y: -20, delay: idx * 100 }} class="fileWrapper my-0! text-left relative group">
          <Dialog.Root onOpenChange={(open) => (open ? (activeItemIdx = idx) : null)}>
            <Dialog.Trigger class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100">
              <Button variant="secondary" size="sm" class="border shadow">View</Button>
            </Dialog.Trigger>
            <Dialog.Content class="min-w-[95vw] min-h-[95dvh] z-100 grid items-center px-3">
              <div class="h-full col-start-1 row-start-1 flex items-center justify-between content-center">
                <button title="Move left" class={cn("bg-muted z-10 rounded p-0.5 border", !activeItemIdx ? "pointer-events-none opacity-0" : null)} type="button" onclick={() => setActiveItem("prev")}>
                  <ArrowLeft size="20" />
                </button>
                <button
                  title="Move right"
                  class={cn("bg-muted z-10 rounded p-0.5 border ", activeItemIdx === items.length - 1 ? "pointer-events-none opacity-0" : null)}
                  type="button"
                  onclick={() => setActiveItem("next")}
                >
                  <ArrowRight size="20" />
                </button>
              </div>

              <figure class="fileWrapper col-start-1 row-start-1 my-0! text-left h-full px-6">
                <a href={basePath + activeItem.filename} target="_blank" class="cursor-pointer">
                  <FilePreview
                    class="max-h-[85dvh] max-w-[90vw] rounded object-contain"
                    id={"file-" + activeItem.id}
                    src={basePath + activeItem.filename}
                    options={{ image: { alt: activeItem.description ?? "" }, video: { autoplay: true } }}
                  />
                </a>
                <figcaption class="mt-2 text-sm text-center">{activeItem.description ?? ""}</figcaption>
              </figure>
            </Dialog.Content>
          </Dialog.Root>
          <FilePreview class="h-56 rounded outline" id={"file-" + item.id} src={basePath + item.filename} options={{ image: { alt: item.description ?? "" } }} />
          <figcaption>{item.description ?? ""}</figcaption>
        </figure>
      {/each}
    </svelte:boundary>
  {/if}
</section>

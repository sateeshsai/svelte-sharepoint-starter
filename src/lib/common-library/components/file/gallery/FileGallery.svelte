<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { File_ListItem } from "$lib/data/types";
  import FilePreview from "$lib/common-library/components/file/FilePreview.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  const { files, folderPath }: { files: File_ListItem[]; folderPath: string } = $props();

  let activeFileIdx: number = $state(0);
  function setActiveFile(direction: "prev" | "next") {
    activeFileIdx = direction === "prev" ? activeFileIdx - 1 : activeFileIdx + 1;
  }
</script>

<section id="gallery" class="gallery grid md:grid-cols-2 xl:grid-cols-3 gap-5">
  {#each files as file, idx (file.Id)}
    {@const activeFile = files[activeFileIdx]}
    <figure class="fileWrapper my-0! text-left relative group">
      <Dialog.Root onOpenChange={(open) => (open ? (activeFileIdx = idx) : null)}>
        <Dialog.Trigger class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100">
          <Button variant="secondary" size="sm" class="border border-muted-foreground">View</Button>
        </Dialog.Trigger>
        <Dialog.Content class="min-w-[95vw] min-h-[95dvh] z-100 grid items-center px-3">
          <!-- <Dialog.Header>
          <Dialog.Title>Title goes here</Dialog.Title>
          <Dialog.Description>Description goes here</Dialog.Description>
        </Dialog.Header> -->

          <div class=" h-full col-start-1 row-start-1 flex items-center justify-between content-center">
            <button title="Move left" class={cn("bg-muted z-10 rounded p-0.5 border", !activeFileIdx ? "pointer-events-none opacity-0" : null)} type="button" onclick={() => setActiveFile("prev")}>
              <ArrowLeft size="20" />
            </button>
            <button
              title="Move right"
              class={cn("bg-muted z-10 rounded p-0.5 border", activeFileIdx === files.length - 1 ? "pointer-events-none opacity-0" : null)}
              type="button"
              onclick={() => setActiveFile("next")}
            >
              <ArrowRight size="20" />
            </button>
          </div>

          <figure class="fileWrapper col-start-1 row-start-1 my-0! text-left h-full px-6">
            <a href={folderPath + activeFile.Title} target="_blank" class="cursor-pointer">
              <FilePreview
                class="max-h-[85dvh] max-w-[90vw] rounded object-contain"
                id={"file-" + activeFile.Id}
                src={"./assets/StoryFiles/" + activeFile.Title}
                options={{ image: { alt: activeFile.Description }, video: { autoplay: true } }}
              />
            </a>
            <figcaption class="mt-2 text-sm text-center">{activeFile.Description ?? ""}</figcaption>
          </figure>
        </Dialog.Content>
      </Dialog.Root>
      <FilePreview class="h-56 rounded outline" id={"file-" + file.Id} src={"./assets/StoryFiles/" + file.Title} options={{ image: { alt: file.Description } }} />
      <figcaption>{file.Description ?? ""}</figcaption>
    </figure>
  {/each}
</section>

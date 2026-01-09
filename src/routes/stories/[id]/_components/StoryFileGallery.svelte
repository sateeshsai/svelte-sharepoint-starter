<script lang="ts">
  /**
   * Story-specific wrapper around MediaGallery.
   * Converts File_ListItem[] to MediaGalleryItem[] format.
   */
  import MediaGallery from "$lib/common-library/components/media/MediaGallery.svelte";
  import type { File_ListItem } from "$lib/data/items/files/schemas";

  const { files, folderPath }: { files: File_ListItem[]; folderPath: string } = $props();

  // Convert story files to generic media gallery items
  const items = $derived(
    files.map((file) => ({
      id: file.Id,
      filename: file.Title,
      description: file.Description,
    }))
  );
</script>

<MediaGallery {items} basePath={folderPath} />

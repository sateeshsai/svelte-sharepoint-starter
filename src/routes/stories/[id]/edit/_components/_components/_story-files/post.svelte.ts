import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";

import type { File_ListItem_Post_ForStory } from "$lib/data/types";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { ReturnResolvedType } from "$lib/common-library/utils/types/util-types";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

export async function updateStoryFile(fileId: number, fileDetailsToUpdate: Partial<File_ListItem_Post_ForStory>, updateFileState: AsyncSubmitState) {
  const provider = getDataProvider();
  const updateResponse = await provider.updateListItem({
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    itemId: fileId,
    body: fileDetailsToUpdate,
  });

  if (updateResponse && "error" in updateResponse) {
    updateFileState.setError("Error updating file's sort order. Error message: " + updateResponse.error);
    return;
  }

  updateFileState.setSuccess();
  return updateResponse;
}

/** Deletes file metadata from Files list (does not delete the actual document library file). */
export async function deleteStoryFile(fileId: number, deleteFileState: AsyncSubmitState) {
  deleteFileState.setInprogress();
  const provider = getDataProvider();
  const deleteFileResponse = await provider.deleteListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    itemId: fileId,
  });

  if (deleteFileResponse && "error" in deleteFileResponse) {
    deleteFileState.setError("Unable to delete file. Error message: " + deleteFileResponse.error);
    return;
  }

  toast.success("File deleted!");

  deleteFileState.setSuccess();
  return deleteFileResponse;
}

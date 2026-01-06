import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { getFormDigestValue } from "$lib/common-library/integrations/sharepoint-rest-api/get/getFormDigestValue";
import { deleteListItem } from "$lib/common-library/integrations/sharepoint-rest-api/delete/deleteListItem";
import { updateListItem } from "$lib/common-library/integrations/sharepoint-rest-api/update/updateListItem";

import type { File_ListItem_Post_ForStory } from "$lib/data/types";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { ReturnResolvedType } from "$lib/common-library/utils/types/util-types";

export async function updateStoryFile(fileId: number, fileDetailsToUpdate: Partial<File_ListItem_Post_ForStory>, updateFileState: AsyncSubmitState) {
  const updateResponse = await updateListItem({
    listName: SHAREPOINT_CONFIG.lists.Files.name,
    itemId: fileId,
    dataToUpdate: fileDetailsToUpdate,
  });

  if ("error" in updateResponse) {
    updateFileState.setError("Error updating file's sort order. Error message: " + updateResponse.error);
    return;
  }

  updateFileState.setSuccess();
  return updateResponse;
}

export async function deleteStoryFile(fileId: number, deleteFileState: AsyncSubmitState) {
  deleteFileState.setInprogress();
  const deleteFileResponse = await deleteListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Files.name,
    itemId: fileId,
  });

  if ("error" in deleteFileResponse) {
    deleteFileState.setError("Unable to delete file. Error message: " + deleteFileResponse.error);
    return;
  }

  toast.success("File deleted!");

  deleteFileState.setSuccess();
  return deleteFileResponse;
}

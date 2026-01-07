import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { readAndUploadFile, type SharePointConfig } from "$lib/common-library/integrations";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

export async function uploadFile(files: File[], fileUploadState: AsyncSubmitState) {
  console.log(files);
  fileUploadState.setInprogress();
  if (!files?.length) {
    fileUploadState.setError("Unable to read the file or no files were selected.");
    return;
  }

  const file = files?.[0]!;

  const provider = getDataProvider();

  const fileUploadResponse = await provider.readAndUploadFile({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    itemId: 0,
    file: file,
    folder: SHAREPOINT_CONFIG.folders.StoryFiles.name,
  });

  if ("error" in fileUploadResponse) {
    fileUploadState.setError("Upload failed. Error message: " + fileUploadResponse.error);
    return;
  }

  fileUploadState.setSuccess();
  return fileUploadResponse;
}

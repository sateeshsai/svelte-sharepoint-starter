import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { readAndUploadFile } from "$lib/common-library/integrations/sharepoint-rest-api/rest-functions/post/readAndUploadFile";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";

export async function uploadFile(files: File[], fileUploadState: AsyncSubmitState) {
  console.log(files);
  fileUploadState.setInprogress();
  if (!files?.length) {
    fileUploadState.setError("Unable to read the file.");
    return;
  }

  const file = files?.[0]!;

  const fileUploadPromise = await readAndUploadFile({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    serverRelativeUrl: SHAREPOINT_CONFIG.folders.StoryFiles.rel_path,
    foldername: SHAREPOINT_CONFIG.folders.StoryFiles.name,
    file: {
      name: file.name,
      obj: file,
    },
  });

  if ("error" in fileUploadPromise) {
    fileUploadState.setError("Upload failed. Error message: " + fileUploadPromise.error);
    return;
  }

  fileUploadState.setSuccess();
  return fileUploadPromise;
}

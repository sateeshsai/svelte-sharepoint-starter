import { dataUriToFile } from "$lib/common-library/utils/functions/file";
import { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { readAnduploadFile } from "$lib/common-library/integrations/sharepoint-rest-api/post/readAndUploadFile";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";

export async function uploadCroppedImage(dataUri: string, file: File, fileUploadState: AsyncSubmitState) {
  fileUploadState.setInprogress();
  const fileToUpload = await dataUriToFile(dataUri, file?.name as string);

  const fileUploadResponse = await readAnduploadFile({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    serverRelativeUrl: SHAREPOINT_CONFIG.folders.StoryFiles.rel_path,
    foldername: SHAREPOINT_CONFIG.folders.StoryFiles.name,
    file: { name: fileToUpload.name, obj: fileToUpload },
  });

  if ("error" in fileUploadResponse) {
    fileUploadState.setError("Error uploading cover art. Error message: " + fileUploadResponse.error);
    return;
  }

  fileUploadState.resetForm();
  return fileUploadResponse;
}

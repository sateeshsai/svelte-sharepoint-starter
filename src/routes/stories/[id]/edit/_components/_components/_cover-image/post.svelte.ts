import { dataUriToFile } from "$lib/common-library/functions/file";
import { AsyncSubmitState } from "$lib/common-library/functions/async.svelte";
import { readAnduploadFile } from "$lib/common-library/sharepoint-rest-api/post/readAndUploadFile";
import { SHAREPOINT_ENV } from "$lib/env/env";

export async function uploadCroppedImage(dataUri: string, file: File, fileUploadState: AsyncSubmitState) {
  fileUploadState.setInprogress();
  const fileToUpload = await dataUriToFile(dataUri, file?.name as string);

  const fileUploadResponse = await readAnduploadFile({
    siteCollectionUrl: SHAREPOINT_ENV.paths.site_collection,
    serverRelativeUrl: SHAREPOINT_ENV.folders.StoryFiles.rel_path,
    foldername: SHAREPOINT_ENV.folders.StoryFiles.name,
    file: { name: fileToUpload.name, obj: fileToUpload },
  });

  if ("error" in fileUploadResponse) {
    fileUploadState.setError("Error uploading cover art. Error message: " + fileUploadResponse.error);
    return;
  }

  fileUploadState.resetForm();
  return fileUploadResponse;
}

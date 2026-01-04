import type { AsyncSubmitState } from "$lib/common-library/utils/functions/async.svelte";
import { readAnduploadFile } from "$lib/common-library/integrations/sharepoint-rest-api/post/readAndUploadFile";
import { SHAREPOINT_ENV } from "$lib/env/env";

export async function uploadFile(files: File[], fileUploadState: AsyncSubmitState) {
  console.log(files);
  fileUploadState.setInprogress();
  if (!files?.length) {
    fileUploadState.setError("Unable to read the file.");
    return;
  }

  const file = files?.[0]!;

  const fileUploadPromise = await readAnduploadFile({
    siteCollectionUrl: SHAREPOINT_ENV.paths.site_collection,
    serverRelativeUrl: SHAREPOINT_ENV.folders.StoryFiles.rel_path,
    foldername: SHAREPOINT_ENV.folders.StoryFiles.name,
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

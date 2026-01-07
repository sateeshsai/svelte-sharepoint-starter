import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { readAndUploadFile } from "$lib/common-library/integrations";

export interface FileUploadOptions {
  siteCollectionUrl: string;
  serverRelativeUrl: string;
  folderName: string;
}

export async function uploadFile(files: File[], fileUploadState: AsyncSubmitState, options: FileUploadOptions) {
  console.log(files);
  fileUploadState.setInprogress();
  if (!files?.length) {
    fileUploadState.setError("Unable to read the file.");
    return;
  }

  if (!options) {
    fileUploadState.setError("Sharepoint file upload options not set.");
    return;
  }

  const file = files?.[0]!;

  const fileUploadPromise = await readAndUploadFile({
    siteCollectionUrl: options.siteCollectionUrl,
    serverRelativeUrl: options.serverRelativeUrl,
    foldername: options.folderName,
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

import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { randomInt } from "$lib/common-library/utils/functions/number";
import { randomIdString } from "$lib/common-library/utils/functions/string";
import type {
  Sharepoint_Error_Formatted,
  Sharepoint_PostItem_SuccessResponse_WithPostedData,
  Sharepoint_PostItemResponse,
  Sharepoint_UploadFile_SuccessResponse,
} from "$lib/common-library/integrations/sharepoint-rest-api/data/types";
import type { File_ListItem, File_ListItem_Post_ForStory } from "$lib/data/types";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { getDataProvider } from "$lib/data/provider-factory";

export type FileDetailsPostSuccessResponses = Sharepoint_PostItem_SuccessResponse_WithPostedData<File_ListItem_Post_ForStory, {}>;

export async function uploadStoryFiles(files: File[], storyFiles: File_ListItem[], storyId: number, fileUploadState: AsyncSubmitState) {
  fileUploadState.setInprogress();

  if (!files?.length) {
    fileUploadState.setError("No valid files were selected. Please try again or report the error by clicking on the Help button.");
    return;
  }

  const provider = getDataProvider();

  // 1. UPLOAD FILES TO STORYFILES FOLDER
  //1.A. PREPARE PROMISES
  const fileUploadPromises: Promise<Sharepoint_Error_Formatted | { Url: string }>[] = [];
  files.forEach((file) => {
    const fileUploadPromise = provider.readAndUploadFile({
      siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
      listName: SHAREPOINT_CONFIG.lists.Files.name,
      itemId: 0,
      file: file,
      folder: SHAREPOINT_CONFIG.folders.StoryFiles.name,
    });

    fileUploadPromises.push(fileUploadPromise);
  });

  const fileUploadResults = await Promise.allSettled(fileUploadPromises);
  const fileUploadErrors: string[] = [];
  const fileUploadSuccessResponses: { Url: string }[] = [];

  // 1.B. VALIDATE RESPONSES
  fileUploadResults.forEach((fileUploadResult) => {
    if (fileUploadResult.status === "fulfilled") {
      const fileUploadResponse = fileUploadResult.value as Sharepoint_Error_Formatted | { Url: string };
      if ("error" in fileUploadResponse) {
        fileUploadErrors.push("File upload failed. Error message: " + fileUploadResponse.error);
      } else {
        fileUploadSuccessResponses.push(fileUploadResponse);
      }
    } else {
      fileUploadErrors.push("File upload was not fulfilled. Status: " + fileUploadResult.status + ". Error message: " + fileUploadResult.reason);
    }
  });

  if (fileUploadErrors.length) {
    fileUploadState.setError(fileUploadErrors.join("\n"));
  }

  // 2. POST UPLOADED FILE DETAILS TO FILES LIST
  //2.A. PREPARE POST PROMISES
  const fileDetailsPromises: Promise<Sharepoint_PostItemResponse<File_ListItem_Post_ForStory, { Id: number }>>[] = [];
  fileUploadSuccessResponses.forEach((fileUploadSuccessResponse, idx) => {
    console.log(fileUploadSuccessResponse);

    const fileDetailsToPost: File_ListItem_Post_ForStory = {
      Title: fileUploadSuccessResponse.Url.split("/").pop() || "file",
      ParentId: storyId,
      Description: "",
      ParentType: "Story",
      FileOrder: Math.max(...storyFiles.map((f) => f.FileOrder), 0) + (idx + 1),
    };

    const fileDetailsPostPromise = provider.postListItem({
      siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
      listName: SHAREPOINT_CONFIG.lists.Files.name,
      body: fileDetailsToPost,
    });
    fileDetailsPromises.push(fileDetailsPostPromise as any);
  });

  const fileDetailsPostResults = await Promise.allSettled(fileDetailsPromises);
  const fileDetailsPostErrors: string[] = [];
  const fileDetailsPostSuccessResponses: FileDetailsPostSuccessResponses[] = [];

  //2.B. VALIDATE POST PROMISES
  fileDetailsPostResults.forEach((fileDetailsPostResult) => {
    console.log(fileDetailsPostResult);
    if (fileDetailsPostResult.status === "fulfilled") {
      const fileDetailsPostResponse = fileDetailsPostResult.value as Sharepoint_PostItemResponse<File_ListItem_Post_ForStory, { Id: number }>;
      if ("error" in fileDetailsPostResponse) {
        fileDetailsPostErrors.push("A file upload failed. Error message: " + fileDetailsPostResponse.error);
      } else {
        fileDetailsPostSuccessResponses.push(fileDetailsPostResponse);
      }
    } else {
      fileDetailsPostErrors.push("A file upload failed. Status: " + fileDetailsPostResult.status + ". Error message: " + fileDetailsPostResult.reason);
    }
  });

  if (fileDetailsPostErrors.length) {
    fileUploadState.appendError(fileDetailsPostErrors.join("\n"));
  }

  fileUploadState.setSuccess();
  return fileDetailsPostSuccessResponses;
}

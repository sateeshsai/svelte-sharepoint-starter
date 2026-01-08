/**
 * Files API - File upload and management operations
 */
import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { apiError, validationError } from "$lib/common-library/integrations";
import { dataUriToFile } from "$lib/common-library/utils/functions/file";
import { readAndUploadFile, type Sharepoint_Error_Formatted, type Sharepoint_PostItemResponse } from "$lib/common-library/integrations";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { File_ListItem, File_ListItem_Post_ForStory } from "./schemas";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

/** Response from postListItem */
export type FileDetailsPostSuccessResponse = File_ListItem_Post_ForStory & {
  Id: number;
  Created: string;
  Modified: string;
  Author: { Id: number; Title: string };
  Parent?: { Id: number; Title: string };
};

// ============================================================================
// POST/UPLOAD Operations
// ============================================================================

/** Converts cropped data URI to file and uploads to StoryFiles folder. */
export async function uploadCroppedImage(dataUri: string, file: File, fileUploadState: AsyncSubmitState) {
  fileUploadState.setInprogress();
  const fileToUpload = await dataUriToFile(dataUri, file?.name as string);

  const fileUploadResponse = await readAndUploadFile({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    serverRelativeUrl: SHAREPOINT_CONFIG.folders.StoryFiles.rel_path,
    foldername: SHAREPOINT_CONFIG.folders.StoryFiles.name,
    file: { name: fileToUpload.name, obj: fileToUpload },
  });

  if ("error" in fileUploadResponse) {
    fileUploadState.setError(apiError({ userMessage: "Error uploading cover art", technicalMessage: fileUploadResponse.error, context: "uploadCroppedImage" }));
    return;
  }

  fileUploadState.resetForm();
  return fileUploadResponse;
}

// ============================================================================
// PUT/UPDATE Operations
// ============================================================================

export async function updateStoryFile(fileId: number, fileDetailsToUpdate: Partial<File_ListItem_Post_ForStory>, updateFileState: AsyncSubmitState) {
  const provider = getDataProvider();
  const updateResponse = await provider.updateListItem({
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    itemId: fileId,
    body: fileDetailsToUpdate,
  });

  if (updateResponse && "error" in updateResponse) {
    updateFileState.setError(apiError({ userMessage: "Error updating file's sort order", technicalMessage: updateResponse.error, context: "updateStoryFile" }));
    return;
  }

  updateFileState.setSuccess();
  return updateResponse;
}

// ============================================================================
// DELETE Operations
// ============================================================================

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
    deleteFileState.setError(apiError({ userMessage: "Unable to delete file", technicalMessage: deleteFileResponse.error, context: "deleteStoryFile" }));
    return;
  }

  toast.success("File deleted!");

  deleteFileState.setSuccess();
  return deleteFileResponse;
}

/**
 * Uploads story files in two phases:
 * 1. Uploads files to StoryFiles document library
 * 2. Creates list items in Files list to track metadata
 */
export async function uploadStoryFiles(files: File[], storyFiles: File_ListItem[], storyId: number, fileUploadState: AsyncSubmitState) {
  fileUploadState.setInprogress();

  if (!files?.length) {
    fileUploadState.setError(validationError({ userMessage: "No valid files were selected. Please try again or report the error.", context: "uploadStoryFiles" }));
    return;
  }

  const provider = getDataProvider();

  // 1. UPLOAD FILES TO STORYFILES FOLDER
  //1.A. PREPARE PROMISES
  const fileUploadPromises: Promise<Sharepoint_Error_Formatted | { Url: string }>[] = [];
  files.forEach((file) => {
    const fileUploadPromise = provider.readAndUploadFile({
      siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
      listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
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
    fileUploadState.setError(apiError({ userMessage: "Some files failed to upload", technicalMessage: fileUploadErrors.join("\n"), context: "uploadStoryFiles" }));
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
      listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
      body: fileDetailsToPost,
    });
    fileDetailsPromises.push(fileDetailsPostPromise as any);
  });

  const fileDetailsPostResults = await Promise.allSettled(fileDetailsPromises);
  const fileDetailsPostErrors: string[] = [];
  const fileDetailsPostSuccessResponses: FileDetailsPostSuccessResponse[] = [];

  //2.B. VALIDATE POST PROMISES
  fileDetailsPostResults.forEach((fileDetailsPostResult) => {
    console.log(fileDetailsPostResult);
    if (fileDetailsPostResult.status === "fulfilled") {
      const fileDetailsPostResponse = fileDetailsPostResult.value as FileDetailsPostSuccessResponse | Sharepoint_Error_Formatted;
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

  // Resetting the form to allow uploading more files.
  fileUploadState.resetForm();
  return fileDetailsPostSuccessResponses;
}

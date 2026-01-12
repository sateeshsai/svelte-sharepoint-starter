/**
 * Files API - File upload and management operations
 */
import {
  apiError,
  validationError,
  createSelectExpandQueries,
  type Sharepoint_Error_Formatted,
  type Sharepoint_PostItemResponse,
  type Sharepoint_UploadFile_SuccessResponse,
} from "$lib/common-library/integrations";
import { createFileListItem } from "./factory";
import { dataUriToFile } from "$lib/common-library/utils/functions/file";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { File_ListItem, File_PostItem } from "./schemas";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { AsyncLoadState, AsyncSubmitState } from "$lib/data/async-state.svelte";

/** Response from postListItem - matches SharePoint POST response format (flat lookup IDs) */
export type FileDetailsPostSuccessResponse = File_PostItem & {
  Id: number;
  Created: string;
  Modified: string;
  AuthorId: number;
  EditorId: number;
  // Lookup fields stay flat in POST response (ParentId, not Parent: { Id, Title })
};

// ============================================================================
// POST/UPLOAD Operations
// ============================================================================

/** Converts cropped data URI to file and uploads to StoryFiles folder. */
export async function uploadCroppedImage(dataUri: string, file: File, fileUploadState: AsyncSubmitState) {
  fileUploadState.setInprogress();
  const fileToUpload = await dataUriToFile(dataUri, file?.name as string);

  const provider = getDataProvider();
  const fileUploadResponse = await provider.readAndUploadFile({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    itemId: 0,
    file: fileToUpload,
    folder: SHAREPOINT_CONFIG.folders.StoryFiles.name,
  });

  console.log({ fileUploadResponse });

  if ("error" in fileUploadResponse) {
    fileUploadState.setError(apiError({ userMessage: "Error uploading cover art", technicalMessage: fileUploadResponse.error, context: "Uploading cover image" }));
    return;
  }

  fileUploadState.setSuccess();
  return fileUploadResponse;
}

// ============================================================================
// PUT/UPDATE Operations
// ============================================================================

export async function updateStoryFile(fileId: number, fileDetailsToUpdate: Partial<File_PostItem>, updateFileState: AsyncSubmitState) {
  const provider = getDataProvider();
  const updateResponse = await provider.updateListItem({
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    itemId: fileId,
    body: fileDetailsToUpdate,
  });

  if (updateResponse && "error" in updateResponse) {
    updateFileState.setError(apiError({ userMessage: "Error updating file's sort order", technicalMessage: updateResponse.error, context: "Updating file order" }));
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
    deleteFileState.setError(apiError({ userMessage: "Unable to delete file", technicalMessage: deleteFileResponse.error, context: "Deleting file" }));
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
    fileUploadState.setError(validationError({ userMessage: "No valid files were selected. Please try again or report the error.", context: "Uploading files" }));
    return;
  }

  const provider = getDataProvider();

  // 1. UPLOAD FILES TO STORYFILES FOLDER
  //1.A. PREPARE PROMISES
  const fileUploadPromises: Promise<Sharepoint_Error_Formatted | Sharepoint_UploadFile_SuccessResponse>[] = [];
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
  const fileUploadSuccessResponses: Sharepoint_UploadFile_SuccessResponse[] = [];

  // 1.B. VALIDATE RESPONSES
  fileUploadResults.forEach((fileUploadResult) => {
    if (fileUploadResult.status === "fulfilled") {
      const fileUploadResponse = fileUploadResult.value as Sharepoint_Error_Formatted | Sharepoint_UploadFile_SuccessResponse;
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
    fileUploadState.setError(apiError({ userMessage: "Some files failed to upload", technicalMessage: fileUploadErrors.join("\n"), context: "Uploading files" }));
  }

  // 2. POST UPLOADED FILE DETAILS TO FILES LIST
  //2.A. PREPARE POST PROMISES
  const fileDetailsPromises: Promise<Sharepoint_PostItemResponse<File_PostItem, { Id: number }>>[] = [];
  fileUploadSuccessResponses.forEach((fileUploadSuccessResponse, idx) => {
    console.log(fileUploadSuccessResponse);

    const fileDetailsToPost: File_PostItem = {
      Title: fileUploadSuccessResponse.Name,
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

// ============================================================================
// GET Operations
// ============================================================================

/**
 * Fetch files associated with a story
 * @param storyId - Parent story ID
 * @param storyFilesLoadState - State object to track loading/error status
 * @param signal - AbortSignal from useAbortController() to cancel request on component unmount
 */
export async function getStoryFiles(storyId: number, storyFilesLoadState: AsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createFileListItem({ ParentId: storyId, ParentType: "Story" }));
  const provider = getDataProvider();
  const storyFilesResponse = await provider.getListItems<{ value: File_ListItem[] }>({
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["filter", `Parent/Id eq ${storyId}`],
      ["top", 5000],
    ],
    signal,
  });

  if ("error" in storyFilesResponse) {
    storyFilesLoadState.setError(apiError({ userMessage: "Could not fetch story files", technicalMessage: storyFilesResponse?.error, context: "Fetching story files" }));
    return;
  }

  storyFilesLoadState.setReady();
  return storyFilesResponse.value;
}

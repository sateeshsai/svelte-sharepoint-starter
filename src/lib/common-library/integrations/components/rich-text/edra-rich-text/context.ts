import type { BaseAsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";

/**
 * Context interface for file upload functionality in Edra Rich Text Editor.
 * Apps provide their own upload implementation via setContext().
 */
export interface EdraFileUploadContext {
  /**
   * Upload a file and return the URL or error.
   * @param file - The file to upload
   * @param state - BaseAsyncSubmitState to track upload progress
   * @returns Promise with either { url: string } on success or { error: string } on failure
   */
  upload: (file: File, state: BaseAsyncSubmitState) => Promise<{ url: string } | { error: string }>;
}

/**
 * Symbol key for the file upload context.
 * Use with setContext/getContext to provide upload functionality.
 *
 * @example
 * // In parent component (app-specific)
 * setContext<EdraFileUploadContext>(EDRA_FILE_UPLOAD_KEY, {
 *   upload: async (file, state) => {
 *     // Your upload logic here
 *     return { url: 'https://...' };
 *   }
 * });
 *
 * // In placeholder components (common-library)
 * const uploadContext = getContext<EdraFileUploadContext>(EDRA_FILE_UPLOAD_KEY);
 */
export const EDRA_FILE_UPLOAD_KEY = Symbol("edra:fileUpload");

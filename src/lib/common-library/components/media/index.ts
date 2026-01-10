/**
 * Media Components
 *
 * Components for file handling, preview, upload, cropping, and gallery display.
 *
 * @example
 * // Upload components
 * import { FileDropZone, CropperJsWrapper } from "$lib/common-library/components/media/upload";
 *
 * // Gallery components
 * import { FilePreview, MediaGallery } from "$lib/common-library/components/media/gallery";
 *
 * // Or import everything from media root
 * import { FileDropZone, MediaGallery, displaySize } from "$lib/common-library/components/media";
 */

// ============================================================================
// File Size Utilities
// ============================================================================

export const BYTE = 1;
export const KILOBYTE = 1024;
export const MEGABYTE = 1024 * KILOBYTE;
export const GIGABYTE = 1024 * MEGABYTE;

/** Format bytes to human-readable string (e.g., "1.5 MB") */
export const displaySize = (bytes: number): string => {
  if (bytes < KILOBYTE) return `${bytes.toFixed(0)} B`;
  if (bytes < MEGABYTE) return `${(bytes / KILOBYTE).toFixed(0)} KB`;
  if (bytes < GIGABYTE) return `${(bytes / MEGABYTE).toFixed(0)} MB`;
  return `${(bytes / GIGABYTE).toFixed(0)} GB`;
};

// Accept patterns for common file types
export const ACCEPT_IMAGE = "image/*";
export const ACCEPT_VIDEO = "video/*";
export const ACCEPT_AUDIO = "audio/*";

// ============================================================================
// Upload Components
// ============================================================================

export { FileDropZone, FileDropZoneWrapper, CropperJsWrapper, ImageCropperState, type FileRejectedReason, type FileDropZoneProps } from "./upload";

// ============================================================================
// Gallery Components
// ============================================================================

export { FilePreview, MediaGallery } from "./gallery";

// ============================================================================
// File Type Utilities
// ============================================================================

export * from "./file_types";
export * from "./file_utils";

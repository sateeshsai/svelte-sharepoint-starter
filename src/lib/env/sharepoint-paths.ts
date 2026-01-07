import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

const ROOT_FOLDER_PATH_RELATIVE_TO_SITE_COLLECTION_URL = "pages/builder-test/"; //https://americas.internal.deloitteonline.com/sites/sitename/<root folder relative path>/pagename.html

/**
 * URL Parsing Logic
 * Extracts SharePoint domain, site collection, and path from window.location
 * Calculated once on app boot - DO NOT MODIFY unless you understand the URL structure
 *
 * PRODUCTION REQUIREMENT: window.location.href must contain "/sites/" for proper detection
 */

// Guard: Check if we can access window (SSR safety)
const _PAGE_URL = typeof window !== "undefined" ? window.location.href.split("#")[0] ?? "" : "";

if (!_PAGE_URL && !LOCAL_MODE) {
  console.error("[SharePoint:Paths] CRITICAL: Failed to parse page URL. This is required in production. " + "Ensure the app is loaded from a valid SharePoint URL.");
}

const _PAGE_URL_SPLIT = _PAGE_URL.split("/sites/");
const _SHAREPOINT_DOMAIN_URL = window.location.origin;
const _SHAREPOINT_SITECOLLECTION_NAME = LOCAL_MODE ? "" : _PAGE_URL_SPLIT?.[1]?.split("/")?.[0] ?? "";
const _SHAREPOINT_SITECOLLECTION_URL = _SHAREPOINT_DOMAIN_URL + (LOCAL_MODE ? "" : "/sites/" + _SHAREPOINT_SITECOLLECTION_NAME);

// Guard: Warn if site collection could not be extracted
if (!_SHAREPOINT_SITECOLLECTION_NAME && !LOCAL_MODE) {
  console.warn(
    "[SharePoint:Paths] WARNING: Could not extract site collection name from URL. " +
      "Expected URL format: https://domain/sites/sitename/path. " +
      "Using domain-level URLs instead. Some operations may fail."
  );
}

const _ROOT_FOLDER_REL_PATH = LOCAL_MODE ? "" : ROOT_FOLDER_PATH_RELATIVE_TO_SITE_COLLECTION_URL;
const _ROOT_FOLDER_URL = LOCAL_MODE ? _PAGE_URL : _SHAREPOINT_SITECOLLECTION_URL + "/" + _ROOT_FOLDER_REL_PATH;
const _ASSETS_FOLDER_URL = _ROOT_FOLDER_URL + "assets/";

/**
 * SharePoint paths derived from current page URL
 * Calculated once on app boot
 */
export const SHAREPOINT_PATHS = {
  root: _ROOT_FOLDER_URL,
  assets: _ASSETS_FOLDER_URL,
  page: _PAGE_URL,
  domain: _SHAREPOINT_DOMAIN_URL,
  site_collection: _SHAREPOINT_SITECOLLECTION_URL,
} as const;

/**
 * Extract relative path from full SharePoint folder URL
 * Used in folder configuration - returns empty string if extraction fails
 * @param folderUrl - Full SharePoint folder URL containing site collection URL
 */
export function getFolderRelativePath(folderUrl: string): string {
  if (!folderUrl) {
    console.warn("[SharePoint:Paths] getFolderRelativePath called with empty URL");
    return "";
  }

  if (!_SHAREPOINT_SITECOLLECTION_URL) {
    console.warn("[SharePoint:Paths] Cannot extract folder path - site collection URL not initialized");
    return "";
  }

  const relativePath = folderUrl.split(_SHAREPOINT_SITECOLLECTION_URL)?.[1];
  if (!relativePath) {
    console.warn(`[SharePoint:Paths] Could not extract relative path from: ${folderUrl}`);
    return "";
  }

  return relativePath;
}

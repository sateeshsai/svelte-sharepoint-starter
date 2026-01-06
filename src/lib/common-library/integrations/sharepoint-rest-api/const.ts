/**
 * SharePoint integration framework constants
 * These are integration-specific and reusable across projects using this framework
 */

/**
 * Valid utility custom access roles for using in a List column.
 * Used for permission validation and role-based access control client-side.
 * Ensure proper permissions are set on the SharePoint lists/folders.
 */
export const ACCESS_ROLES = ["Admin", null] as const;

/**
 * Standard error recovery actions presented to users
 * Used by error handling and error boundary components
 */
export const RECOMMENDED_ERROR_ACTIONS_FOR_UI = {
  reload: " Please try reloading the browser tab or click on the Help button to report this error.",
  report: " Please click on the Help button to report this error.",
};

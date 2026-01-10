/**
 * Common Library Utilities
 *
 * Reusable utility functions, constants, and types.
 *
 * @example
 * ```typescript
 * // Styling constants
 * import { SECTION_CLASSES, HEADING_CLASSES } from "$lib/common-library/utils";
 *
 * // Pure functions
 * import { debounce, formatDate } from "$lib/common-library/utils/functions";
 *
 * // Async state management
 * import { BaseAsyncLoadState, BaseAsyncSubmitState } from "$lib/common-library/utils/async";
 *
 * // Local dev detection
 * import { LOCAL_MODE } from "$lib/common-library/utils/local-dev";
 * ```
 */

// Styling utilities (CSS classes)
export * from "./styling";

// Async state management
export * from "./async";

// Pure utility functions (debounce, formatDate, string utils, etc.)
// Note: Import from ./functions for individual exports to avoid namespace pollution
// export * from "./functions";

// Type utilities
// Note: Import from ./types for type exports
// export * from "./types";

// Local development utilities
// Note: Import LOCAL_MODE from ./local-dev
// export * from "./local-dev";

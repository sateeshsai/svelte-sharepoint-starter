/**
 * Pure async state management utilities
 * Framework and integration agnostic - no external dependencies
 */

import type { BaseAsyncLoadState, BaseAsyncSubmitState } from "./async.svelte";
export { BaseAsyncSubmitState, BaseAsyncLoadState } from "./async.svelte";

/** Context key for app-layer async state factory injection */
export const ASYNC_STATE_CONTEXT_KEY = "asyncStateFactory";

/** Factory type for creating async state instances with app-specific behavior (e.g., error reporting) */
export type AsyncStateFactory = {
  createLoadState: () => BaseAsyncLoadState;
  createSubmitState: () => BaseAsyncSubmitState;
};

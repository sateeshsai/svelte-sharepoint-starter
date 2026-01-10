/**
 * Engagement context for dependency injection
 *
 * Allows common-library components to access app-specific user info
 * without directly importing from app layer.
 *
 * Usage in App.svelte:
 *   import { initEngagementContext } from "./engagement-context";
 *   import { currentUserId } from "$lib/data/global-state.svelte";
 *   initEngagementContext({ getCurrentUserId: currentUserId });
 */
import { getContext, setContext } from "svelte";

/** Context key for engagement user info injection */
export const ENGAGEMENT_CONTEXT_KEY = "engagementContext";

/** Context type for engagement-related user functions */
export interface EngagementContext {
  /** Get current user's ID (undefined if not logged in) */
  getCurrentUserId: () => number | undefined;
}

/** Default fallback - returns undefined (no user) */
const DEFAULT_CONTEXT: EngagementContext = {
  getCurrentUserId: () => undefined,
};

/**
 * Get engagement context from Svelte context.
 * Falls back to default (no user) if not initialized.
 */
export function getEngagementContext(): EngagementContext {
  return getContext<EngagementContext>(ENGAGEMENT_CONTEXT_KEY) ?? DEFAULT_CONTEXT;
}

/**
 * Initialize engagement context. Call once in App.svelte.
 * Provides common-library components access to app-specific user info.
 *
 * @example
 * // In App.svelte
 * import { initEngagementContext } from "$lib/common-library/integrations/components/engagements";
 * import { currentUserId } from "$lib/data/global-state.svelte";
 * initEngagementContext({ getCurrentUserId: currentUserId });
 */
export function initEngagementContext(context: EngagementContext): void {
  setContext<EngagementContext>(ENGAGEMENT_CONTEXT_KEY, context);
}

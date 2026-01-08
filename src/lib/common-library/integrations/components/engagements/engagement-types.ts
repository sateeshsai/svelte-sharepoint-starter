/**
 * Engagement-related types
 * Core types are derived from Zod schemas in engagement-schemas.ts
 * This file contains supplementary types for UI components
 */

// Re-export schema-derived types as the source of truth
export type { Engagement_ListItem, Engagement_Post } from "./engagement-schemas";

/** Emoji reaction categories for UI grouping */
export type EmojiCategory = "appreciation" | "insight" | "celebration" | "specialized";

/** Emoji reaction definition for picker components */
export interface EmojiReaction {
  emoji: string;
  label: string;
  category: EmojiCategory;
  description?: string;
}

/** Aggregated reaction count for display */
export interface EmojiReactionCount {
  emoji: string;
  count: number;
}

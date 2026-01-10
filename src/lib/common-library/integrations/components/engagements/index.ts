// UI Components
export { default as EngagementSection } from "./EngagementSection.svelte";
export { default as EngagementSummary } from "./EngagementSummary.svelte";

// Constants (emojis, categories)
export * from "./engagement-constants";

// Context (for library isolation - app layer must init in App.svelte)
export { ENGAGEMENT_CONTEXT_KEY, getEngagementContext, initEngagementContext, type EngagementContext } from "./engagement-context";

// Data fetchers (low-level API calls)
export { getEngagements, pollEngagements, postReaction, postComment, deleteEngagement, groupReactionsByEmoji, getComments, getReactions } from "./engagement-api";

// Handlers (high-level with optimistic updates, shared across routes)
export { addEngagement, removeEngagement, isOwnEngagement } from "./engagement-handlers";

// Schemas and validation
export {
  EngagementSchema,
  EngagementListSchema,
  EngagementPostSchema,
  createEngagementSchema,
  createEngagementListSchema,
  createEngagementPostSchema,
  validateReactionForPost,
  validateCommentForPost,
  validateEngagementForPost,
  isReaction,
  isComment,
} from "./engagement-schemas";

// Types
export type { Engagement_ListItem, Engagement_Post, EmojiReaction, EmojiCategory, EmojiReactionCount } from "./engagement-types";

// Local mock data
export { LOCAL_ENGAGEMENTS } from "./local-data";

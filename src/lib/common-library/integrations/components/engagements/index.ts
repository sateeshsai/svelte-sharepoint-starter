// UI Component
export { default as EngagementSection } from "./EngagementSection.svelte";

// Constants (emojis, categories)
export * from "./engagement-constants";

// Data fetchers (low-level API calls)
export { getEngagements, postReaction, postComment, deleteEngagement, groupReactionsByEmoji, getComments, getReactions } from "./engagement-api";

// Handlers (high-level with optimistic updates, shared across routes)
export { addEngagement, removeEngagement, findUserReaction, isOwnEngagement } from "./engagement-handlers";

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

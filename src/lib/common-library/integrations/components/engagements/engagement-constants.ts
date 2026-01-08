import type { EmojiReaction, EmojiCategory } from "./engagement-types";

export const EMOJI_REACTIONS: Record<string, EmojiReaction> = {
  heart: { emoji: "❤️", label: "Love", category: "appreciation" },
  thumbsUp: { emoji: "👍", label: "Thumbs up", category: "appreciation" },
  clap: { emoji: "👏", label: "Clap", category: "celebration" },
  hooray: { emoji: "🎉", label: "Hooray", category: "celebration" },
  laugh: { emoji: "😄", label: "Laugh", category: "insight" },
  wow: { emoji: "😮", label: "Wow", category: "insight" },
  rocket: { emoji: "🚀", label: "Rocket", category: "specialized" },
  star: { emoji: "⭐", label: "Star", category: "appreciation" },
};

export const EMOJI_REACTIONS_ARRAY = Object.values(EMOJI_REACTIONS).map((r) => ({ emoji: r.emoji, label: r.label, category: r.category }));

export const EMOJI_CATEGORIES: EmojiCategory[] = ["appreciation", "insight", "celebration", "specialized"];

export function getEmojisByCategory(category: EmojiCategory) {
  return EMOJI_REACTIONS_ARRAY.filter((r) => r.category === category);
}

export function findEmojiReaction(emoji: string) {
  return EMOJI_REACTIONS_ARRAY.find((r) => r.emoji === emoji) ?? null;
}

export function getEmojiLabel(emoji: string) {
  return findEmojiReaction(emoji)?.label ?? emoji;
}

export function isValidEmoji(emoji: string) {
  return !!findEmojiReaction(emoji);
}

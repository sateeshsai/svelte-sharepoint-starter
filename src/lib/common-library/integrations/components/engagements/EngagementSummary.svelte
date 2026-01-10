<script lang="ts">
  /**
   * EngagementSummary - Compact read-only display of engagement counts
   * For use in story thumbnails/cards. Uses container queries for responsive sizing.
   *
   * Parent must have `@container` class for container queries to work.
   */
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import { groupReactionsByEmoji, getComments, type Engagement_ListItem } from "./index";

  interface Props {
    engagements: Engagement_ListItem[] | undefined;
    /** Max emojis to show before truncating */
    maxEmojis?: number;
    class?: string;
  }

  let { engagements, maxEmojis = 3, class: className = "" }: Props = $props();

  let summary = $derived.by(() => {
    if (!engagements) return { reactions: [], commentCount: 0, totalReactions: 0 };
    const reactions = groupReactionsByEmoji(engagements);
    const comments = getComments(engagements);
    return {
      reactions,
      commentCount: comments.length,
      totalReactions: reactions.reduce((sum, r) => sum + r.count, 0),
    };
  });

  let hasContent = $derived(summary.totalReactions > 0 || summary.commentCount > 0);
</script>

{#if hasContent}
  <div class="engagement-summary flex items-center gap-2 text-muted-foreground @xs:gap-3 {className}">
    {#if summary.totalReactions > 0}
      <div class="flex items-center gap-0.5 @xs:gap-1">
        {#each summary.reactions.slice(0, maxEmojis) as reaction}
          <span class="text-xs @xs:text-sm">{reaction.emoji}</span>
        {/each}
        <span class="text-[10px] @xs:text-xs ml-0.5">{summary.totalReactions}</span>
      </div>
    {/if}
    {#if summary.commentCount > 0}
      <div class="flex items-center gap-0.5 @xs:gap-1">
        <MessageCircle class="size-3 @xs:size-3.5" />
        <span class="text-[10px] @xs:text-xs">{summary.commentCount}</span>
      </div>
    {/if}
  </div>
{/if}

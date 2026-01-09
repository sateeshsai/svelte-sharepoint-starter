<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Popover from "$lib/components/ui/popover";
  import SmilePlus from "@lucide/svelte/icons/smile-plus";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import LineAnimated from "$lib/common-library/components/animation/LineAnimated.svelte";
  import StatusMessage from "$lib/common-library/components/feedback/StatusMessage.svelte";
  import { EMOJI_REACTIONS_ARRAY, groupReactionsByEmoji, getComments, getReactions, type Engagement_ListItem } from "./index";
  import { isOwnEngagement } from "./engagement-handlers";
  import { Confetti } from "svelte-confetti";
  import type { BaseAsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
  import { slide, fade, scale } from "svelte/transition";
  import { elasticOut } from "svelte/easing";
  import { currentUserId } from "$lib/data/global-state.svelte";

  type SectionMode = "reactions" | "comments";

  interface Props {
    engagements: Engagement_ListItem[] | undefined;
    engagementsLoadState: BaseAsyncLoadState;
    onAddReaction: (emoji: string) => Promise<void>;
    onAddComment: (text: string) => Promise<void>;
    onDeleteEngagement: (id: number) => Promise<void>;
    ReactionSubmissionIsInProgress?: boolean;
    CommentSubmissionIsInProgress?: boolean;
    /** Which section to render - reactions (top of page) or comments (bottom) */
    mode: SectionMode;
  }

  let {
    engagements,
    engagementsLoadState,
    onAddReaction,
    onAddComment,
    onDeleteEngagement,
    ReactionSubmissionIsInProgress = $bindable(false),
    CommentSubmissionIsInProgress = $bindable(false),
    mode,
  }: Props = $props();

  let commentText = $state("");
  let isCommentsOpen = $state(true);
  let showAllReactions = $state(false);
  let showConfetti = $state(false);
  let lastReactionEmoji = $state<string | null>(null);
  let newReactionPopOverOpen = $state(false);
  let deletingId = $state<number | null>(null);

  let reactionCounts = $derived.by(() => {
    if (!engagements) return [];
    return groupReactionsByEmoji(engagements);
  });

  let comments = $derived.by(() => {
    if (!engagements) return [];
    return getComments(engagements);
  });

  let reactions = $derived.by(() => {
    if (!engagements) return [];
    return getReactions(engagements);
  });

  let displayedReactions = $derived.by(() => {
    if (showAllReactions) return reactionCounts;
    return reactionCounts.slice(0, 7);
  });

  /** Find if current user has reacted with this emoji */
  function userHasReaction(emoji: string): Engagement_ListItem | undefined {
    const userId = currentUserId();
    return reactions.find((r) => r.Title === emoji && r.Author.Id === userId);
  }

  async function handleReactionClick(emoji: string) {
    if (ReactionSubmissionIsInProgress) return;

    const existingReaction = userHasReaction(emoji);

    if (existingReaction) {
      // User clicked their own reaction - delete it
      deletingId = existingReaction.Id;
      await onDeleteEngagement(existingReaction.Id);
      deletingId = null;
    } else {
      // Add new reaction
      newReactionPopOverOpen = false;
      lastReactionEmoji = emoji;
      showConfetti = true;

      ReactionSubmissionIsInProgress = true;
      await onAddReaction(emoji);
      ReactionSubmissionIsInProgress = false;

      setTimeout(() => {
        lastReactionEmoji = null;
        showConfetti = false;
      }, 1200);
    }
  }

  async function handleSubmitComment(event: SubmitEvent) {
    event.preventDefault();
    if (!commentText.trim() || CommentSubmissionIsInProgress) return;

    CommentSubmissionIsInProgress = true;
    const text = commentText.trim();
    commentText = "";
    await onAddComment(text);
    CommentSubmissionIsInProgress = false;
  }

  async function handleDeleteComment(id: number) {
    deletingId = id;
    await onDeleteEngagement(id);
    deletingId = null;
  }
</script>

{#if mode === "reactions" && engagementsLoadState.ready && engagements}
  <section class="not-prose mb-6" aria-label="Reactions">
    <div class="flex gap-2 flex-wrap items-center">
      <Popover.Root bind:open={newReactionPopOverOpen}>
        <Popover.Trigger>
          <button
            class="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/50 hover:border-muted-foreground hover:bg-muted transition-colors text-sm"
            disabled={ReactionSubmissionIsInProgress}
            aria-label="Add reaction"
          >
            <SmilePlus size={16} class="text-muted-foreground" />
          </button>
        </Popover.Trigger>
        <Popover.Content class="w-80">
          <div class="space-y-3">
            <h3 class="font-medium text-sm">Choose a reaction</h3>
            <div class="grid grid-cols-7 gap-2">
              {#each EMOJI_REACTIONS_ARRAY as reaction}
                {@const hasReacted = !!userHasReaction(reaction.emoji)}
                <button
                  type="button"
                  onclick={() => handleReactionClick(reaction.emoji)}
                  class="p-2 hover:bg-muted rounded-md transition-colors text-2xl {hasReacted ? 'bg-primary/20 ring-1 ring-primary' : ''}"
                  title={hasReacted ? `Remove ${reaction.label}` : reaction.label}
                  aria-label={hasReacted ? `Remove ${reaction.label}` : reaction.label}
                  disabled={ReactionSubmissionIsInProgress || deletingId !== null}
                >
                  {reaction.emoji}
                </button>
              {/each}
            </div>
          </div>
        </Popover.Content>
      </Popover.Root>

      {#each displayedReactions as reaction}
        {@const userReaction = userHasReaction(reaction.emoji)}
        <button
          type="button"
          onclick={() => handleReactionClick(reaction.emoji)}
          class="relative flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm transition-all {userReaction
            ? 'bg-primary/20 border-primary hover:bg-primary/30'
            : 'bg-muted hover:bg-muted/80'}"
          disabled={deletingId !== null}
          title={userReaction ? "Click to remove your reaction" : "Click to add this reaction"}
          in:slide={{ duration: 350 }}
          out:fade={{ duration: 200 }}
        >
          {#key lastReactionEmoji === reaction.emoji && showConfetti}
            <span class="text-lg" role="img" aria-label="Reaction" in:scale={{ duration: 600, start: 0.5, easing: elasticOut }}>{reaction.emoji}</span>
          {/key}
          <span class="font-medium">{reaction.count}</span>
          {#if showConfetti && lastReactionEmoji === reaction.emoji}
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Confetti amount={20} fallDistance="30px" duration={1200} />
            </div>
          {/if}
        </button>
      {/each}

      {#if reactionCounts.length > 7}
        <Popover.Root bind:open={showAllReactions}>
          <Popover.Trigger>
            <button class="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors text-sm" aria-label="Show all reactions">
              <span class="text-muted-foreground">+{reactionCounts.length - 7}</span>
            </button>
          </Popover.Trigger>
          <Popover.Content class="w-80">
            <div class="space-y-3">
              <h3 class="font-medium text-sm">All Reactions</h3>
              <div class="flex gap-2 flex-wrap max-h-60 overflow-y-auto">
                {#each reactionCounts as reaction}
                  <div class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted border text-sm">
                    <span class="text-lg" role="img" aria-label="Reaction">{reaction.emoji}</span>
                    <span class="font-medium">{reaction.count}</span>
                  </div>
                {/each}
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>
      {/if}
    </div>
  </section>
{:else if mode === "comments"}
  <section class="mt-12 not-prose relative" aria-labelledby="comments-heading">
    <LineAnimated class="mb-6" />

    {#if engagementsLoadState?.loading}
      <StatusMessage type="loading" message="Loading comments..." />
    {:else if engagementsLoadState.ready && engagements}
      <div class="border rounded-lg">
        <button
          onclick={() => (isCommentsOpen = !isCommentsOpen)}
          class="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          aria-expanded={isCommentsOpen}
          aria-controls="comments-content"
        >
          <h2 id="comments-heading" class="text-xl font-semibold">
            Comments {#if comments.length > 0}({comments.length}){/if}
          </h2>
          <ChevronDown size={20} class="transition-transform duration-300 ease-in-out text-muted-foreground" style="transform: rotate({isCommentsOpen ? 180 : 0}deg)" />
        </button>

        {#if isCommentsOpen}
          <div id="comments-content" class="px-4 pb-4" transition:slide={{ duration: 300 }}>
            <form onsubmit={handleSubmitComment} class="mb-6">
              <div class="space-y-3">
                <Textarea bind:value={commentText} placeholder="Share your thoughts..." rows={3} disabled={CommentSubmissionIsInProgress} class="resize-none" aria-label="Comment text" />
                <div class="flex justify-end">
                  <Button type="submit" disabled={CommentSubmissionIsInProgress || !commentText.trim()} size="sm">
                    {CommentSubmissionIsInProgress ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </form>

            {#if comments.length > 0}
              <ul class="space-y-4" role="list">
                {#each comments as comment (comment.Id)}
                  {@const isOwn = isOwnEngagement(comment)}
                  <li class="border rounded-lg p-4 bg-card" transition:slide={{ duration: 200 }}>
                    <header class="flex items-start justify-between mb-2">
                      <span class="text-sm font-medium">{comment.Author.Title}</span>
                      <div class="flex items-center gap-2">
                        <time class="text-xs text-muted-foreground" datetime={comment.Created}>
                          {new Date(comment.Created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        {#if isOwn}
                          <button
                            type="button"
                            onclick={() => handleDeleteComment(comment.Id)}
                            disabled={deletingId === comment.Id}
                            class="text-muted-foreground hover:text-destructive transition-colors p-1 -m-1"
                            title="Delete comment"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={14} class={deletingId === comment.Id ? "animate-pulse" : ""} />
                          </button>
                        {/if}
                      </div>
                    </header>
                    <p class="text-sm">{comment.Content}</p>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="text-sm text-muted-foreground">No comments yet. Start the conversation!</p>
            {/if}
          </div>
        {/if}
      </div>
    {:else if engagementsLoadState?.error}
      <StatusMessage type="error" message={engagementsLoadState.error} />
    {/if}
  </section>
{/if}

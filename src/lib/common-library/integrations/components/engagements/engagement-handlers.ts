/**
 * Engagement handlers with optimistic updates
 * Shared across routes - import from engagements index
 *
 * Uses context injection for user info to maintain library isolation.
 * App layer must call initEngagementContext() in App.svelte.
 */
import { toast } from "svelte-sonner";
import type { Engagement_ListItem } from "./engagement-types";
import { deleteEngagement as deleteEngagementApi } from "./engagement-api";
import { EngagementPostSchema } from "./engagement-schemas";
import { getEngagementContext } from "./engagement-context";
import type { DataProvider } from "../../sharepoint-rest-api/providers/data-provider";

type EngagementType = "Reaction" | "Comment";
type ParentType = "Story" | "Article" | "Post";

interface AddEngagementParams {
  provider: DataProvider;
  listName: string;
  parentId: number;
  parentTitle: string;
  parentType: ParentType;
  engagementType: EngagementType;
  /** Emoji for reactions, text for comments */
  content: string;
  engagements: Engagement_ListItem[] | undefined;
  /** Current user info for optimistic update display */
  currentUser: { Id: number; Title: string };
  signal?: AbortSignal;
  /** Validate against EngagementPostSchema before posting. Default: true */
  validate?: boolean;
}

interface DeleteEngagementParams {
  provider: DataProvider;
  listName: string;
  engagementId: number;
  engagements: Engagement_ListItem[] | undefined;
  /** Current user ID for ownership check */
  userId: number;
  signal?: AbortSignal;
}

/** Add engagement (reaction or comment) with optimistic update */
export async function addEngagement(params: AddEngagementParams): Promise<Engagement_ListItem[] | undefined> {
  const { provider, listName, parentId, parentTitle, parentType, engagementType, content, engagements, currentUser, signal, validate = true } = params;

  const userId = currentUser.Id;
  if (userId === undefined) return engagements;

  let baseEngagements = engagements;

  // For reactions: remove existing reaction from same user (replace behavior)
  if (engagementType === "Reaction") {
    const existingReaction = engagements?.find((e) => e.EngagementType === "Reaction" && e.Author.Id === userId);
    if (existingReaction) {
      baseEngagements = engagements?.filter((e) => e.Id !== existingReaction.Id);
    }
  }

  // Optimistic update
  const optimisticId = -Date.now();
  const optimisticEngagement: Engagement_ListItem = {
    Id: optimisticId,
    Title: engagementType === "Reaction" ? content : "",
    Parent: { Id: parentId, Title: parentTitle },
    ParentType: parentType,
    EngagementType: engagementType,
    Content: engagementType === "Comment" ? content : null,
    Author: {
      Id: userId,
      Title: currentUser.Title,
    },
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
  };

  const updatedEngagements = [...(baseEngagements || []), optimisticEngagement];

  // Build request body
  const body = {
    Title: engagementType === "Reaction" ? content : "",
    ParentId: parentId,
    ParentType: parentType,
    EngagementType: engagementType,
    Content: engagementType === "Comment" ? content : "",
  };

  // Validate if enabled (default: true)
  if (validate) {
    const validation = EngagementPostSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join(", ");
      toast.error(`Invalid engagement: ${errorMsg}`);
      return engagements; // Revert
    }
  }

  const result = await provider.postListItem({
    listName,
    body,
    signal,
  });

  if ("error" in result) {
    const actionName = engagementType === "Reaction" ? "add reaction" : "post comment";
    toast.error(`Failed to ${actionName}: ${result.error}`);
    return engagements; // Revert
  }

  // Replace optimistic engagement with server response (has real Id)
  const finalEngagements = updatedEngagements.map((e) => (e.Id === optimisticId ? { ...optimisticEngagement, ...result, Id: result.Id } : e));

  return finalEngagements;
}

/** Remove engagement with optimistic update */
export async function removeEngagement(params: DeleteEngagementParams): Promise<Engagement_ListItem[] | undefined> {
  const { provider, listName, engagementId, engagements, userId, signal } = params;

  if (!engagements) return engagements;

  const engagement = engagements.find((e) => e.Id === engagementId);
  if (!engagement) return engagements;

  // Silent guard - UI should prevent this, but don't proceed if not owner
  if (engagement.Author.Id !== userId) {
    return engagements;
  }

  // Optimistic removal
  const updatedEngagements = engagements.filter((e) => e.Id !== engagementId);

  const result = await deleteEngagementApi(provider, listName, engagementId, signal);

  if (result && "error" in result) {
    toast.error("Failed to delete: " + result.error);
    return engagements; // Revert
  }

  toast.success("Deleted");
  return updatedEngagements;
}

/**
 * Check if current user owns an engagement.
 * Uses context injection - requires initEngagementContext() in App.svelte.
 */
export function isOwnEngagement(engagement: Engagement_ListItem): boolean {
  const ctx = getEngagementContext();
  return engagement.Author.Id === ctx.getCurrentUserId();
}

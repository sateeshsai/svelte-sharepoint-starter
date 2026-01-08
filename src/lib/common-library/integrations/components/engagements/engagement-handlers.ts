/**
 * Engagement handlers with optimistic updates
 * Shared across routes - import from engagements index
 */
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import { currentUserId, global_State } from "$lib/data/global-state.svelte";
import type { Engagement_ListItem } from "./engagement-types";
import { deleteEngagement as deleteEngagementApi } from "./engagement-fetchers";
import { EngagementPostSchema } from "./engagement-schemas";

type EngagementType = "Reaction" | "Comment";
type ParentType = "Story" | "Article" | "Post";

interface AddEngagementParams {
  parentId: number;
  parentTitle: string;
  parentType: ParentType;
  engagementType: EngagementType;
  /** Emoji for reactions, text for comments */
  content: string;
  engagements: Engagement_ListItem[] | undefined;
  signal?: AbortSignal;
  /** Validate against EngagementPostSchema before posting. Default: true */
  validate?: boolean;
}

interface DeleteEngagementParams {
  engagementId: number;
  engagements: Engagement_ListItem[] | undefined;
  signal?: AbortSignal;
}

/** Add engagement (reaction or comment) with optimistic update */
export async function addEngagement(params: AddEngagementParams): Promise<Engagement_ListItem[] | undefined> {
  const { parentId, parentTitle, parentType, engagementType, content, engagements, signal, validate = true } = params;

  if (!global_State.currentUser) return engagements;

  const userId = currentUserId();
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
      Id: userId || 0,
      Title: global_State.currentUser.Title || "You",
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

  const provider = getDataProvider();
  const result = await provider.postListItem({
    listName: SHAREPOINT_CONFIG.lists.Engagements.name,
    body,
    signal,
  });

  if ("error" in result) {
    const actionName = engagementType === "Reaction" ? "add reaction" : "post comment";
    toast.error(`Failed to ${actionName}: ${result.error}`);
    return engagements; // Revert
  }

  toast.success(engagementType === "Reaction" ? "Reaction added!" : "Comment posted!");
  return updatedEngagements;
}

/** Remove engagement with optimistic update */
export async function removeEngagement(params: DeleteEngagementParams): Promise<Engagement_ListItem[] | undefined> {
  const { engagementId, engagements, signal } = params;

  if (!engagements) return engagements;

  const engagement = engagements.find((e) => e.Id === engagementId);
  if (!engagement) return engagements;

  // Silent guard - UI should prevent this, but don't proceed if not owner
  const userId = currentUserId();
  if (engagement.Author.Id !== userId) {
    return engagements;
  }

  // Optimistic removal
  const updatedEngagements = engagements.filter((e) => e.Id !== engagementId);

  const provider = getDataProvider();
  const result = await deleteEngagementApi(provider, SHAREPOINT_CONFIG.lists.Engagements.name, engagementId, signal);

  if (result && "error" in result) {
    toast.error("Failed to delete: " + result.error);
    return engagements; // Revert
  }

  toast.success("Deleted");
  return updatedEngagements;
}

/** Find current user's reaction in engagements list */
export function findUserReaction(engagements: Engagement_ListItem[] | undefined): Engagement_ListItem | undefined {
  const userId = currentUserId();
  return engagements?.find((e) => e.EngagementType === "Reaction" && e.Author.Id === userId);
}

/** Check if current user owns an engagement */
export function isOwnEngagement(engagement: Engagement_ListItem): boolean {
  return engagement.Author.Id === currentUserId();
}

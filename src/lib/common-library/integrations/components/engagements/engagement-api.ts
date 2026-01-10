import type { DataProvider } from "../../sharepoint-rest-api/providers/data-provider";
import type { Engagement_ListItem, EmojiReactionCount } from "./engagement-types";
import type { BaseAsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { apiError } from "$lib/common-library/integrations/error-handling";
import { poll } from "../../sharepoint-rest-api/rest-functions/helpers/poll";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

export async function getEngagements(provider: DataProvider, listName: string, parentId: number, engagementsLoadState?: BaseAsyncLoadState, signal?: AbortSignal) {
  const resp = await provider.getListItems<{ value: Engagement_ListItem[] }>({
    listName,
    operations: [
      ["filter", `Parent/Id eq ${parentId}`],
      ["top", 5000],
    ],
    signal,
  });

  if ("error" in resp) {
    engagementsLoadState?.setError(apiError({ userMessage: "Could not fetch engagements", technicalMessage: String(resp.error), context: "getEngagements" }));
    return [] as Engagement_ListItem[];
  }
  engagementsLoadState?.setReady();
  return resp.value;
}

/**
 * Poll for engagement updates at regular intervals
 * Returns a stop function to halt polling
 *
 * @param provider - Data provider (mock or SharePoint)
 * @param listName - Engagements list name
 * @param parentId - Parent item ID to filter engagements
 * @param onUpdate - Callback with latest engagements array
 * @param loadState - Optional load state to track status
 * @returns Stop function to halt polling
 *
 * @example
 * const stop = pollEngagements(provider, "Engagements", 123, (data) => {
 *   engagements = data;
 * });
 * // Later: stop();
 */
export function pollEngagements(provider: DataProvider, listName: string, parentId: number, onUpdate: (engagements: Engagement_ListItem[]) => void, loadState?: BaseAsyncLoadState): () => void {
  // Poll more frequently in LOCAL_MODE for testing (5s vs 20s)
  const intervalMs = LOCAL_MODE ? 5000 : 20000;

  const fetchFn = async () => {
    const resp = await provider.getListItems<{ value: Engagement_ListItem[] }>({
      listName,
      operations: [
        ["filter", `Parent/Id eq ${parentId}`],
        ["top", 5000],
      ],
      cacheResponse: false, // Always fetch fresh for polling
    });

    if ("error" in resp) {
      throw new Error(String(resp.error));
    }
    return resp.value;
  };

  return poll(
    fetchFn,
    intervalMs,
    (data) => {
      loadState?.setReady();
      onUpdate(data);
    },
    (error) => {
      loadState?.setError(
        apiError({
          userMessage: "Could not poll engagements",
          technicalMessage: String(error),
          context: "pollEngagements",
        })
      );
    }
  );
}

export async function postReaction(provider: DataProvider, listName: string, parentId: number, emoji: string, parentType = "Story", signal?: AbortSignal) {
  const body = {
    Title: emoji,
    ParentId: parentId,
    ParentType: parentType,
    EngagementType: "Reaction",
    Content: "",
  } as Record<string, any>;

  const result = await provider.postListItem({ listName, body, signal });
  return result as Engagement_ListItem | { error: any };
}

export async function postComment(provider: DataProvider, listName: string, parentId: number, text: string, parentType = "Story", signal?: AbortSignal) {
  const body = {
    Title: "",
    ParentId: parentId,
    ParentType: parentType,
    EngagementType: "Comment",
    Content: text,
  } as Record<string, any>;

  const result = await provider.postListItem({ listName, body, signal });
  return result as Engagement_ListItem | { error: any };
}

export async function deleteEngagement(provider: DataProvider, listName: string, itemId: number, signal?: AbortSignal) {
  const result = await provider.deleteListItem({ listName, itemId, signal });
  return result;
}

export function groupReactionsByEmoji(engagements: Engagement_ListItem[]) {
  const map: Record<string, number> = {};
  for (const e of engagements) {
    if (e.EngagementType === "Reaction") {
      map[e.Title] = (map[e.Title] || 0) + 1;
    }
  }
  const arr: EmojiReactionCount[] = Object.entries(map).map(([emoji, count]) => ({ emoji, count }));
  // sort descending
  arr.sort((a, b) => b.count - a.count);
  return arr;
}

export function getComments(engagements: Engagement_ListItem[]) {
  return engagements.filter((e) => e.EngagementType === "Comment");
}

export function getReactions(engagements: Engagement_ListItem[]) {
  return engagements.filter((e) => e.EngagementType === "Reaction");
}

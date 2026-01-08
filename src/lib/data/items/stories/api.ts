/**
 * Stories API - All story-related data operations
 */
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { createSelectExpandQueries, getEngagements, type Sharepoint_Get_Operations } from "$lib/common-library/integrations";
import { createNew_Story_ListItem, createNew_File_ListItem, createNew_Story_Post } from "$lib/data/new-items.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { convert_Story_ListItem_ToPost } from "$lib/data/convert-items";
import type { File_ListItem, Story_ListItem } from "$lib/data/types";
import type { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { toast } from "svelte-sonner";
import { navigate } from "sv-router/generated";

// Re-export engagement handlers for convenience
export { addEngagement, removeEngagement } from "$lib/common-library/integrations/components/engagements";

// ============================================================================
// GET Operations
// ============================================================================

/**
 * Fetch stories from SharePoint/mock data
 * Supports incremental polling with lastFetchedInPollTimeString filter
 * @param cacheResponse - Set false for real-time polling
 */
export async function getStories(
  storiesLoadState: AsyncLoadState,
  lastFetchedInPollTimeString?: string | undefined,
  signal?: AbortSignal,
  cacheResponse: boolean = true
): Promise<Story_ListItem[] | undefined> {
  const selectExpand = createSelectExpandQueries(createNew_Story_ListItem());

  const operations: Sharepoint_Get_Operations = [
    ["select", selectExpand.select],
    ["expand", selectExpand.expand],
    ["top", 5000],
  ];

  if (lastFetchedInPollTimeString) {
    operations.push(["filter", `Created ge '${lastFetchedInPollTimeString}'`]);
  }

  const provider = getDataProvider();

  const fetchResponse = await provider.getListItems<{ value: Story_ListItem[] }>({
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    operations: operations,
    logToConsole: false,
    signal,
    cacheResponse,
  });

  if ("error" in fetchResponse) {
    if (!lastFetchedInPollTimeString) {
      storiesLoadState.setError("Something went wrong. Could not fetch stories. " + fetchResponse?.error);
    } else {
      toast.error("Lives updates failed. Please reload the browser window to see new stories, if any.", { duration: Infinity, dismissable: true, style: "--width:75%" });
    }
    return undefined;
  }

  storiesLoadState.setReady();
  return fetchResponse.value;
}

export async function getStory(storyId: number, storyLoadState: AsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createNew_Story_ListItem);
  const provider = getDataProvider();
  const fetchResponse = await provider.getListItems<{ value: Story_ListItem[] }>({
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["filter", `Id eq ${storyId}`],
      ["top", 5000],
    ],
    logToConsole: false,
    signal,
  });

  if ("error" in fetchResponse) {
    storyLoadState.setError("Something went wrong. Could not fetch story. " + fetchResponse.error);
    return;
  }

  if (!fetchResponse.value.length) {
    storyLoadState.setError("No story with the Id: " + storyId + ". " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.report);
    return;
  }

  storyLoadState.setReady();
  return fetchResponse.value[0];
}

export async function getStoryFiles(storyId: number, storyFilesLoadState: AsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createNew_File_ListItem({ ParentId: storyId, ParentType: "Story" }));
  const provider = getDataProvider();
  const storyFilesResponse = await provider.getListItems<{ value: File_ListItem[] }>({
    listName: SHAREPOINT_CONFIG.lists.StoryFiles.name,
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["filter", `Parent/Id eq ${storyId}`],
      ["top", 5000],
    ],
    signal,
  });

  if ("error" in storyFilesResponse) {
    storyFilesLoadState.setError("Something went wrong. Could not fetch story files. " + storyFilesResponse?.error);
    return;
  }

  storyFilesLoadState.setReady();
  return storyFilesResponse.value;
}

export async function getStoryEngagements(storyId: number, engagementsLoadState: AsyncLoadState, signal?: AbortSignal) {
  const provider = getDataProvider();
  return await getEngagements(provider, SHAREPOINT_CONFIG.lists.Engagements.name, storyId, engagementsLoadState, signal);
}

// ============================================================================
// POST/CREATE Operations
// ============================================================================

/** Creates a new story and navigates to its edit page. */
export async function postNewStory(newStoryState: AsyncSubmitState) {
  const newStoryToPost = createNew_Story_Post();
  const provider = getDataProvider();
  const postNewStoryResponse = await provider.postListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    body: newStoryToPost,
    logToConsole: true,
  });

  if ("error" in postNewStoryResponse) {
    newStoryState.setError("Something went wrong. Could not create a new story. " + postNewStoryResponse.error);
    return;
  }

  const newId = postNewStoryResponse.Id;
  if (!newId) {
    newStoryState.setError("Story created but no Id returned");
    return;
  }

  navigate("/stories/:id/edit", {
    params: {
      id: String(newId),
    },
    replace: true,
  });
}

// ============================================================================
// PUT/UPDATE Operations
// ============================================================================

export async function updateStory(story: Story_ListItem, storySubmissionState: AsyncSubmitState) {
  storySubmissionState.setInprogress();

  const dataToPost = convert_Story_ListItem_ToPost(story);
  const provider = getDataProvider();

  const storyUpdateResponse = await provider.updateListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    itemId: story.Id,
    body: dataToPost,
  });

  if (storyUpdateResponse && "error" in storyUpdateResponse) {
    storySubmissionState.setError("Error saving story. " + storyUpdateResponse.error);
    return;
  }

  storySubmissionState.setSuccess();
  return storyUpdateResponse;
}

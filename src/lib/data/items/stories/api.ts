/**
 * Stories API - All story-related data operations
 */
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { createSelectExpandQueries, getEngagements, type Sharepoint_Get_Operations, apiError, notFoundError } from "$lib/common-library/integrations";
import { createStoryTemplate, createStoryPost, storyToPost } from "./factory";
import { createFileTemplate } from "$lib/data/items/files/factory";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import type { Story_ListItem } from "./schemas";
import type { File_ListItem } from "$lib/data/items/files/schemas";
import type { BaseAsyncLoadState, BaseAsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { toast } from "svelte-sonner";
import { navigate } from "sv-router/generated";

// Re-export engagement handlers for convenience
export { addEngagement, removeEngagement } from "$lib/common-library/integrations/components/engagements";

// ============================================================================
// GET Operations
// ============================================================================

/**
 * Fetch stories from SharePoint/mock data.
 * Supports incremental polling with lastFetchedInPollTimeString filter.
 * 
 * @param storiesLoadState - State object to track loading/error status. Use AsyncLoadState for auto error reporting.
 * @param lastFetchedInPollTimeString - ISO timestamp to fetch only stories created after this time (for polling)
 * @param signal - AbortSignal from useAbortController() to cancel request on component unmount
 * @param cacheResponse - Set false for real-time polling to bypass cache
 * @returns Array of stories or undefined on error
 */
export async function getStories(
  storiesLoadState: BaseAsyncLoadState,
  lastFetchedInPollTimeString?: string | undefined,
  signal?: AbortSignal,
  cacheResponse: boolean = true
): Promise<Story_ListItem[] | undefined> {
  const selectExpand = createSelectExpandQueries(createStoryTemplate());

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
      storiesLoadState.setError(apiError({ userMessage: "Could not fetch stories", technicalMessage: fetchResponse.error, context: "getStories" }));
    } else {
      toast.error("Lives updates failed. Please reload the browser window to see new stories, if any.", { duration: Infinity, dismissable: true, style: "--width:75%" });
    }
    return undefined;
  }

  storiesLoadState.setReady();
  return fetchResponse.value;
}

/**
 * Fetch a single story by ID
 * @param storyId - Story ID to fetch
 * @param storyLoadState - State object to track loading/error status. Use AsyncLoadState for auto error reporting.
 * @param signal - AbortSignal from useAbortController() to cancel request on component unmount
 */
export async function getStory(storyId: number, storyLoadState: BaseAsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createStoryTemplate());
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
    storyLoadState.setError(apiError({ userMessage: "Could not fetch story", technicalMessage: fetchResponse.error, context: "getStory" }));
    return;
  }

  if (!fetchResponse.value.length) {
    storyLoadState.setError(notFoundError({ userMessage: `No story with Id: ${storyId}. ${RECOMMENDED_ERROR_ACTIONS_FOR_UI.report}`, context: "getStory" }));
    return;
  }

  storyLoadState.setReady();
  return fetchResponse.value[0];
}

/**
 * Fetch files associated with a story
 * @param storyId - Parent story ID
 * @param storyFilesLoadState - State object to track loading/error status
 * @param signal - AbortSignal from useAbortController() to cancel request on component unmount
 */
export async function getStoryFiles(storyId: number, storyFilesLoadState: BaseAsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createFileTemplate({ ParentId: storyId, ParentType: "Story" }));
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
    storyFilesLoadState.setError(apiError({ userMessage: "Could not fetch story files", technicalMessage: storyFilesResponse?.error, context: "getStoryFiles" }));
    return;
  }

  storyFilesLoadState.setReady();
  return storyFilesResponse.value;
}

/**
 * Fetch engagements (reactions/comments) for a story
 * @param storyId - Parent story ID
 * @param engagementsLoadState - State object to track loading/error status
 * @param signal - AbortSignal from useAbortController() to cancel request on component unmount
 */
export async function getStoryEngagements(storyId: number, engagementsLoadState: BaseAsyncLoadState, signal?: AbortSignal) {
  const provider = getDataProvider();
  return await getEngagements(provider, SHAREPOINT_CONFIG.lists.Engagements.name, storyId, engagementsLoadState, signal);
}

// ============================================================================
// POST/CREATE Operations
// ============================================================================

/** Creates a new story and navigates to its edit page. */
export async function postNewStory(newStoryState: BaseAsyncSubmitState) {
  const newStoryToPost = createStoryPost();
  const provider = getDataProvider();
  const postNewStoryResponse = await provider.postListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    body: newStoryToPost,
    logToConsole: true,
  });

  if ("error" in postNewStoryResponse) {
    newStoryState.setError(apiError({ userMessage: "Could not create a new story", technicalMessage: postNewStoryResponse.error, context: "postNewStory" }));
    return;
  }

  const newId = postNewStoryResponse.Id;
  if (!newId) {
    newStoryState.setError(apiError({ userMessage: "Story created but no Id returned", technicalMessage: "Missing Id in response", context: "postNewStory" }));
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

export async function updateStory(story: Story_ListItem, storySubmissionState: BaseAsyncSubmitState) {
  storySubmissionState.setInprogress();

  const dataToPost = storyToPost(story);
  const provider = getDataProvider();

  const storyUpdateResponse = await provider.updateListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    itemId: story.Id,
    body: dataToPost,
  });

  if (storyUpdateResponse && "error" in storyUpdateResponse) {
    storySubmissionState.setError(apiError({ userMessage: "Error saving story", technicalMessage: storyUpdateResponse.error, context: "updateStory" }));
    return;
  }

  storySubmissionState.setSuccess();
  return storyUpdateResponse;
}

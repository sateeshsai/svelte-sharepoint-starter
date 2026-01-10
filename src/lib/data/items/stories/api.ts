/**
 * Stories API - All story-related data operations
 */
import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { createSelectExpandQueries, getEngagements, pollEngagements, type Sharepoint_Get_Operations, apiError, notFoundError, type Engagement_ListItem } from "$lib/common-library/integrations";
import { createStoryListItem, createStoryPostItem, storyListItemToPostItem } from "./factory";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { global_State } from "$lib/data/global-state.svelte";
import type { Story_ListItem } from "./schemas";
import type { BaseAsyncLoadState, BaseAsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { getCachedOrFetch, invalidateCacheByList } from "$lib/common-library/utils/cache";
import { toast } from "svelte-sonner";
import { navigate } from "sv-router/generated";
import { addEngagement as addEngagementBase, removeEngagement as removeEngagementBase } from "$lib/common-library/integrations/components/engagements";

// Cache key for stories list
const STORIES_CACHE_KEY = "stories-list";
const STORIES_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

// ============================================================================
// Engagement Wrappers (inject app-layer dependencies)
// ============================================================================

type StoryEngagementType = "Reaction" | "Comment";

interface AddStoryEngagementParams {
  parentId: number;
  parentTitle: string;
  engagementType: StoryEngagementType;
  content: string;
  engagements: Engagement_ListItem[] | undefined;
  signal?: AbortSignal;
}

interface RemoveStoryEngagementParams {
  engagementId: number;
  engagements: Engagement_ListItem[] | undefined;
  signal?: AbortSignal;
}

/**
 * Add engagement to a story. Wraps common-library handler with app dependencies.
 */
export async function addEngagement(params: AddStoryEngagementParams): Promise<Engagement_ListItem[] | undefined> {
  const currentUser = global_State.currentUser;
  if (!currentUser) return params.engagements;

  return addEngagementBase({
    provider: getDataProvider(),
    listName: SHAREPOINT_CONFIG.lists.Engagements.name,
    parentType: "Story",
    currentUser: { Id: currentUser.Id, Title: currentUser.Title },
    ...params,
  });
}

/**
 * Remove engagement from a story. Wraps common-library handler with app dependencies.
 */
export async function removeEngagement(params: RemoveStoryEngagementParams): Promise<Engagement_ListItem[] | undefined> {
  const currentUser = global_State.currentUser;
  if (!currentUser) return params.engagements;

  return removeEngagementBase({
    provider: getDataProvider(),
    listName: SHAREPOINT_CONFIG.lists.Engagements.name,
    userId: currentUser.Id,
    ...params,
  });
}

// ============================================================================
// GET Operations
// ============================================================================

/**
 * Fetch stories with IndexedDB caching and stale-while-revalidate pattern.
 *
 * Behavior:
 * - First load: Returns cached data immediately if available (sets stale state), fetches fresh in background
 * - Polling: Skips cache, fetches only new items since lastFetchedInPollTimeString
 *
 * @param storiesLoadState - State object to track loading/error/stale status
 * @param lastFetchedInPollTimeString - ISO timestamp for polling (skips cache when provided)
 * @param signal - AbortSignal from useAbortController() to cancel request on component unmount
 * @param cacheResponse - Set false for real-time polling to bypass in-memory dedup cache
 * @returns Array of stories or undefined on error
 */
export async function getStories(
  storiesLoadState: BaseAsyncLoadState,
  lastFetchedInPollTimeString?: string | undefined,
  signal?: AbortSignal,
  cacheResponse: boolean = true
): Promise<Story_ListItem[] | undefined> {
  // Polling mode: skip IndexedDB cache, fetch only new items
  if (lastFetchedInPollTimeString) {
    return fetchStoriesFromProvider(storiesLoadState, lastFetchedInPollTimeString, signal, cacheResponse);
  }

  // Initial load: use IndexedDB cache with stale-while-revalidate
  const result = await getCachedOrFetch<Story_ListItem[]>({
    cacheKey: STORIES_CACHE_KEY,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    maxAge: STORIES_CACHE_MAX_AGE,
    onStale: () => storiesLoadState.setStale(),
    onFresh: () => storiesLoadState.setReady(),
    fetchFn: async () => {
      return await fetchStoriesFromProvider(storiesLoadState, undefined, signal, cacheResponse);
    },
  });

  if (result.stale) {
    // Data is from cache, fresh fetch happening in background
    storiesLoadState.setStale();
  } else if (result.data) {
    storiesLoadState.setReady();
  }

  return result.data;
}

/**
 * Internal: Fetch stories directly from provider (no IndexedDB caching)
 */
async function fetchStoriesFromProvider(
  storiesLoadState: BaseAsyncLoadState,
  lastFetchedInPollTimeString?: string | undefined,
  signal?: AbortSignal,
  cacheResponse: boolean = true
): Promise<Story_ListItem[] | undefined> {
  const selectExpand = createSelectExpandQueries(createStoryListItem());

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
      storiesLoadState.setError(apiError({ userMessage: "Could not fetch stories", technicalMessage: fetchResponse.error, context: "Fetching stories" }));
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
  const selectExpand = createSelectExpandQueries(createStoryListItem());
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
    storyLoadState.setError(apiError({ userMessage: "Could not fetch story", technicalMessage: fetchResponse.error, context: "Fetching story" }));
    return;
  }

  if (!fetchResponse.value.length) {
    storyLoadState.setError(notFoundError({ userMessage: `No story with Id: ${storyId}. ${RECOMMENDED_ERROR_ACTIONS_FOR_UI.report}`, context: "Fetching story" }));
    return;
  }

  storyLoadState.setReady();
  return fetchResponse.value[0];
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

/**
 * Poll for engagement updates on a story
 * Automatically uses appropriate interval (5s LOCAL_MODE, 20s SharePoint)
 * Filters out current user's engagements from poll results (user's own reactions
 * are already known through optimistic updates, avoiding visual duplicates)
 * @param storyId - Parent story ID
 * @param onUpdate - Callback with latest engagements array (excludes current user's)
 * @param loadState - Optional state object to track loading/error status
 * @returns Stop function to halt polling
 * @example
 * const stop = pollStoryEngagements(123, (data) => { engagements = data; });
 * onCleanup(() => stop());
 */
export function pollStoryEngagements(storyId: number, onUpdate: (engagements: Engagement_ListItem[]) => void, loadState?: BaseAsyncLoadState): () => void {
  const provider = getDataProvider();
  const currentUserId = global_State.currentUser?.Id;

  // Wrap onUpdate to filter out current user's engagements
  const filteredOnUpdate = (engagements: Engagement_ListItem[]) => {
    const filtered = currentUserId ? engagements.filter((e) => e.Author.Id !== currentUserId) : engagements;
    onUpdate(filtered);
  };

  return pollEngagements(provider, SHAREPOINT_CONFIG.lists.Engagements.name, storyId, filteredOnUpdate, loadState);
}

// ============================================================================
// POST/CREATE Operations
// ============================================================================

/** Creates a new story and navigates to its edit page. */
export async function postNewStory(newStoryState: BaseAsyncSubmitState) {
  const newStoryToPost = createStoryPostItem();
  const provider = getDataProvider();
  const postNewStoryResponse = await provider.postListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    body: newStoryToPost,
    // logToConsole: true,
  });

  if ("error" in postNewStoryResponse) {
    newStoryState.setError(apiError({ userMessage: "Could not create a new story", technicalMessage: postNewStoryResponse.error, context: "Creating story" }));
    return;
  }

  const newId = postNewStoryResponse.Id;
  if (!newId) {
    newStoryState.setError(apiError({ userMessage: "Story created but no Id returned", technicalMessage: "Missing Id in response", context: "Creating story" }));
    return;
  }

  // Invalidate stories cache so next fetch gets fresh data
  await invalidateCacheByList(SHAREPOINT_CONFIG.lists.Story.name);

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

  const dataToPost = storyListItemToPostItem(story);
  const provider = getDataProvider();

  const storyUpdateResponse = await provider.updateListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    itemId: story.Id,
    body: dataToPost,
  });

  if (storyUpdateResponse && "error" in storyUpdateResponse) {
    storySubmissionState.setError(apiError({ userMessage: "Error saving story", technicalMessage: storyUpdateResponse.error, context: "Saving story" }));
    return;
  }

  // Invalidate stories cache so next fetch gets fresh data
  await invalidateCacheByList(SHAREPOINT_CONFIG.lists.Story.name);

  storySubmissionState.setSuccess();
  return storyUpdateResponse;
}

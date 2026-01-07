import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { createSelectExpandQueries } from "$lib/common-library/integrations/sharepoint-rest-api/utilities/helpers";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { createNew_File_ListItem } from "$lib/data/new-items.svelte";
import type { File_ListItem, Story_ListItem } from "$lib/data/types";
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";

export async function getStory(storyId: number, storyLoadState: AsyncLoadState, signal?: AbortSignal) {
  console.log("[getStory] fetching storyId=", storyId);
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

  console.log("[getStory] response=", fetchResponse);

  if ("error" in fetchResponse) {
    storyLoadState.setError("Something went wrong. Could not create a new story. " + fetchResponse.error);
    return;
  }

  if (!fetchResponse.value.length) {
    storyLoadState.setError("No story with the Id: " + storyId + ". " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.report);
    return;
  }
  // storyLoadState.setData(fetchResponse.value[0]);
  storyLoadState.setReady();
  console.log("[getStory] returning story=", fetchResponse.value[0]);
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

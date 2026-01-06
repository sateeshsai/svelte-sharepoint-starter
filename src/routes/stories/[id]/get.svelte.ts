import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/const";
import { getListItems } from "$lib/common-library/integrations/sharepoint-rest-api/get/getListItems";
import { createSelectExpandQueries } from "$lib/common-library/integrations/sharepoint-rest-api/helpers";
import { LOCAL_STORY_ITEMS } from "$lib/data/local-data";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { LOCAL_FILES } from "$lib/data/local-data";
import { createNew_File_ListItem } from "$lib/data/new-items.svelte";
import type { File_ListItem, Story_ListItem } from "$lib/data/types";
import { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";

export async function getStory(storyId: number, storyLoadState: AsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createNew_Story_ListItem);
  const fetchResponse = await getListItems({
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS.filter((s) => s.Id === storyId)! },
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["filter", `Id eq '${storyId}'`],
      ["top", 5000],
    ],
    logToConsole: false,
    signal,
  });

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
  return fetchResponse.value[0];
}

export async function getStoryFiles(storyId: number, storyFilesLoadState: AsyncLoadState, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createNew_File_ListItem({ ParentId: storyId, ParentType: "Story" }));
  const storyFilesResponse = await getListItems({
    listName: SHAREPOINT_CONFIG.lists.Files.name,
    dataToReturnInLocalMode: {
      value: LOCAL_FILES.filter((f) => f.Parent.Id === storyId),
    },
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
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

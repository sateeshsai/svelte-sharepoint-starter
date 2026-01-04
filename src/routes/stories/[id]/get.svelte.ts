import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/const";
import { getListItems } from "$lib/common-library/integrations/sharepoint-rest-api/get/getListItems";
import { createSelectExapandQueries } from "$lib/common-library/integrations/sharepoint-rest-api/helpers";
import { LOCAL_STORY_ITEMS } from "$lib/data/local-data";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import { SHAREPOINT_ENV } from "$lib/env/env";
import { LOCAL_FILES } from "$lib/data/local-data";
import { createNew_File_ListItem } from "$lib/data/new-items.svelte";
import type { File_ListItem, Story_ListItem } from "$lib/data/types";
import type { AsyncLoadState } from "$lib/common-library/utils/functions/async.svelte";

export async function getStory(storyId: number, storyLoadState: AsyncLoadState<Story_ListItem>) {
  const selectExpand = createSelectExapandQueries(createNew_Story_ListItem);
  const fetchResponse = await getListItems({
    listName: SHAREPOINT_ENV.lists.Story.name,
    dataToReturnInLocalMode: { value: LOCAL_STORY_ITEMS.filter((s) => s.Id === storyId)! },
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["filter", `Id eq '${storyId}'`],
      ["top", 5000],
    ],
    logToConsole: false,
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

export async function getStoryFiles(storyId: number, storyFilesLoadState: AsyncLoadState<File_ListItem[]>) {
  const selectExpand = createSelectExapandQueries(createNew_File_ListItem({ ParentId: storyId, ParentType: "Story" }));
  const storyFilesResponse = await getListItems({
    listName: SHAREPOINT_ENV.lists.Files.name,
    dataToReturnInLocalMode: {
      value: LOCAL_FILES.filter((f) => f.Parent.Id === storyId),
    },
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["top", 5000],
    ],
  });

  if ("error" in storyFilesResponse) {
    storyFilesLoadState.setError("Something went wrong. Could not fetch story files. " + storyFilesResponse?.error);
    return;
  }

  storyFilesLoadState.setReady();

  return storyFilesResponse.value;
}

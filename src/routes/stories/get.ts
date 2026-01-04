import type { AsyncLoadState } from "$lib/common-library/functions/async.svelte";
import { getListItems } from "$lib/common-library/sharepoint-rest-api/get/getListItems";
import { createSelectExapandQueries } from "$lib/common-library/sharepoint-rest-api/helpers";
import { LOCAL_STORY_ITEMS } from "$lib/data/local-data";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import type { Story_ListItem } from "$lib/data/types";
import { SHAREPOINT_ENV } from "$lib/env/env";

export async function getStories(storiesLoadState: AsyncLoadState<Story_ListItem[]>) {
  const selectExpand = createSelectExapandQueries(createNew_Story_ListItem());

  const fetchResponse = await getListItems({
    listName: SHAREPOINT_ENV.lists.Story.name,
    dataToReturnInLocalMode: {
      value: LOCAL_STORY_ITEMS,
    },
    operations: [
      ["select", selectExpand.select],
      ["expand", selectExpand.expand],
      ["top", 5000],
    ],
    logToConsole: false,
  });

  if ("error" in fetchResponse) {
    storiesLoadState.setError("Something went wrong. Could not fetch stories. " + fetchResponse.error);
    return;
  }

  storiesLoadState.setReady();

  return fetchResponse.value;
}

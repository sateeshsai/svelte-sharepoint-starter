import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { randomInt } from "$lib/common-library/utils/functions/number";
import { randomIdString } from "$lib/common-library/utils/functions/string";
import { getListItems } from "$lib/common-library/integrations/sharepoint-rest-api/get/getListItems";
import { createSelectExpandQueries } from "$lib/common-library/integrations/sharepoint-rest-api/helpers";
import type { Sharepoint_Get_Operations } from "$lib/common-library/integrations/sharepoint-rest-api/types";
import { LOCAL_STORY_ITEMS } from "$lib/data/local-data";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import type { Story_ListItem } from "$lib/data/types";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";

export async function getStories(storiesLoadState: AsyncLoadState, lastFetchedInPollTimeString?: string | undefined, signal?: AbortSignal) {
  const selectExpand = createSelectExpandQueries(createNew_Story_ListItem());

  const operations: Sharepoint_Get_Operations = [
    ["select", selectExpand.select],
    ["expand", selectExpand.expand],
    ["top", 5000],
  ];

  if (lastFetchedInPollTimeString) {
    operations.push(["filter", `Created ge '${lastFetchedInPollTimeString}'`]);
  }

  // Simulating fetching new stories because of polling in LOCAL_MODE
  const newStoriesToReturn_InPoll_InLocalMode =
    Math.random() < 0.5
      ? [
          ...LOCAL_STORY_ITEMS.slice(0, 1).map((s) => {
            return {
              ...s,
              Title: "New story from DB " + randomInt(),
              Id: randomInt(),
              Created: new Date().toISOString(),
            };
          }),
        ]
      : [];

  const fetchResponse = await getListItems({
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    dataToReturnInLocalMode: {
      value: lastFetchedInPollTimeString ? newStoriesToReturn_InPoll_InLocalMode : LOCAL_STORY_ITEMS,
    },
    operations: operations,
    logToConsole: false,
    signal,
  });

  if ("error" in fetchResponse) {
    if (!lastFetchedInPollTimeString) {
      storiesLoadState.setError("Something went wrong. Could not fetch stories. " + fetchResponse?.error);
    } else {
      toast.error("Lives updates failed. Please reload the browser window to see new stories, if any.", { duration: Infinity, dismissable: true, style: "--width:75%" });
    }
    return;
  }

  storiesLoadState.setReady();
  return fetchResponse.value;
}

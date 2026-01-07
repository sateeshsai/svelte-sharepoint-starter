import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { createSelectExpandQueries, type Sharepoint_Get_Operations } from "$lib/common-library/integrations";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import type { Story_ListItem } from "$lib/data/types";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

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

  const fetchResponse = await provider.getListItems({
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
  return fetchResponse.value as Story_ListItem[];
}

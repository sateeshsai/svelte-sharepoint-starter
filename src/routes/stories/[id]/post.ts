import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
import { createNew_Story_Post } from "$lib/data/new-items.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { navigate } from "sv-router/generated";
import type { Story_ListItem } from "$lib/data/types";
import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import type { ReturnResolvedType } from "$lib/common-library/utils/types/util-types";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

/**
 * Creates a new story and navigates to its edit page.
 * On success, redirects to /stories/:id/edit with the new story ID.
 */
export async function postNewStory(newStoryState: AsyncSubmitState) {
  const newStoryToPost = createNew_Story_Post();
  const provider = getDataProvider();
  const postNewStoryResponse = await provider.postListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    body: newStoryToPost,
    logToConsole: true,
  });

  console.log("[postNewStory] response:", postNewStoryResponse);

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

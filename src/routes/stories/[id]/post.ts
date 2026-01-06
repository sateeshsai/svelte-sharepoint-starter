import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/integrations/sharepoint-rest-api/constants/const";
import { convert_Story_ListItem_ToPost } from "$lib/data/convert-items";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { navigate } from "sv-router/generated";
import type { Story_ListItem } from "$lib/data/types";
import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import type { ReturnResolvedType } from "$lib/common-library/utils/types/util-types";
import { getDataProvider } from "$lib/data/provider-factory";

export async function postNewStory(newStoryState: AsyncSubmitState) {
  const newStoryToPost = convert_Story_ListItem_ToPost(createNew_Story_ListItem());
  const provider = getDataProvider();
  const postNewStoryResponse = await provider.postListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    body: newStoryToPost,
  });

  if ("error" in postNewStoryResponse) {
    newStoryState.setError("Something went wrong. Could not create a new story. " + postNewStoryResponse.error);
    return;
  }

  navigate("/stories/:id/edit", {
    params: {
      id: String(postNewStoryResponse.d.Id),
    },
    replace: true,
  });
}

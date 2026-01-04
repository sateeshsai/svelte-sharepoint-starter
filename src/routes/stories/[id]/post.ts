import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "$lib/common-library/sharepoint-rest-api/const";
import { getFormDigestValue } from "$lib/common-library/sharepoint-rest-api/get/getFormDigestValue";
import { postListItem } from "$lib/common-library/sharepoint-rest-api/post/postListItem";
import { convert_Story_ListItem_ToPost } from "$lib/data/convert-items";
import { createNew_Story_ListItem } from "$lib/data/new-items.svelte";
import { SHAREPOINT_ENV } from "$lib/env/env";
import { navigate } from "sv-router/generated";
import type { Story_ListItem } from "$lib/data/types";
import type { AsyncSubmitState } from "$lib/common-library/functions/async.svelte";
import type { ReturnResolvedType } from "$lib/common-library/types/util-types";

export async function postNewStory(newStoryState: AsyncSubmitState) {
  const formDigestValue = await getFormDigestValue();
  const newStoryToPost = convert_Story_ListItem_ToPost(createNew_Story_ListItem());
  const postNewStoryResponse = await postListItem({
    siteCollectionUrl: SHAREPOINT_ENV.paths.site_collection,
    listName: SHAREPOINT_ENV.lists.Story.name,
    formDigest: formDigestValue as string,
    dataToPost: newStoryToPost,
    dataToIncludeInResponse_InLocalMode: { Id: 1 }, //Routing to an existing local story in LOCAL_MODE
  });

  if ("error" in postNewStoryResponse) {
    newStoryState.setError("Something went wrong. Could not create a new story. " + postNewStoryResponse.error);
    return;
  }

  navigate("/stories/:id/edit", {
    params: {
      id: String(postNewStoryResponse.Id),
    },
    replace: true,
  });
}

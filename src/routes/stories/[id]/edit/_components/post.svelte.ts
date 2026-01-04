import type { AsyncSubmitState } from "$lib/common-library/functions/async.svelte";
import { getFormDigestValue } from "$lib/common-library/sharepoint-rest-api/get/getFormDigestValue";
import { updateListItem } from "$lib/common-library/sharepoint-rest-api/update/updateListItem";
import { convert_Story_ListItem_ToPost } from "$lib/data/convert-items";
import type { Story_ListItem } from "$lib/data/types";
import { SHAREPOINT_ENV } from "$lib/env/env";

export async function updateStory(story: Story_ListItem, storySubmissionState: AsyncSubmitState) {
  storySubmissionState.setInprogress();

  const dataToPost = convert_Story_ListItem_ToPost(story);

  const formDigestValue = await getFormDigestValue();
  const storyUpdateResponse = await updateListItem({
    siteCollectionUrl: SHAREPOINT_ENV.paths.site_collection,
    listName: SHAREPOINT_ENV.lists.Story.name,
    itemId: story.Id,
    formDigest: formDigestValue as string,
    dataToUpdate: dataToPost,
  });

  if ("error" in storyUpdateResponse) {
    storySubmissionState.setError("Error saving story. " + storyUpdateResponse.error);
    return;
  }

  storySubmissionState.setSuccess();
  return storyUpdateResponse;
}

import type { AsyncSubmitState } from "$lib/common-library/utils/async/async.svelte";
import { convert_Story_ListItem_ToPost } from "$lib/data/convert-items";
import type { Story_ListItem } from "$lib/data/types";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";

export async function updateStory(story: Story_ListItem, storySubmissionState: AsyncSubmitState) {
  storySubmissionState.setInprogress();

  const dataToPost = convert_Story_ListItem_ToPost(story);
  const provider = getDataProvider();

  const storyUpdateResponse = await provider.updateListItem({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    listName: SHAREPOINT_CONFIG.lists.Story.name,
    itemId: story.Id,
    body: dataToPost,
  });

  if (storyUpdateResponse && "error" in storyUpdateResponse) {
    storySubmissionState.setError("Error saving story. " + storyUpdateResponse.error);
    return;
  }

  storySubmissionState.setSuccess();
  return storyUpdateResponse;
}

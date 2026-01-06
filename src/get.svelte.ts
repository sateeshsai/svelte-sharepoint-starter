import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { getDataProvider } from "$lib/data/provider-factory";
import { setCurrentUser, setAccessRole, setUserProperties } from "$lib/data/global-state.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { Sharepoint_User_Properties } from "$lib/common-library/integrations/sharepoint-rest-api/data/types";

export async function getAndStoreCurrentUserInfo(dataLoadState: AsyncLoadState) {
  const provider = getDataProvider();

  const fetchResponse = await provider.getCurrentUser({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    logToConsole: false,
  });

  if ("error" in fetchResponse) {
    const errorMessage = "Something went wrong. Could not fetch user details. " + fetchResponse.error;
    dataLoadState.setError(errorMessage);
    navigator.clipboard.writeText(fetchResponse.error);
    toast.error(fetchResponse.error);
    return;
  }

  //STORE IN GLOBAL STATE
  setCurrentUser(fetchResponse);

  //FETCH USER ACCESS ROLE
  const userId = fetchResponse.Id!;

  const userAccessRoleFetchResponse = await provider.getListItems({
    listName: SHAREPOINT_CONFIG.lists.UsersInfo.name,
    operations: [
      ["select", "User/Id,AccessRole"],
      ["expand", "User"],
      ["filter", `User/Id eq ${userId}`],
    ],
  });

  if ("error" in userAccessRoleFetchResponse) {
    const errorMessage = "Something went wrong. Could not verify user role. " + userAccessRoleFetchResponse.error;
    dataLoadState.setError(errorMessage);
    navigator.clipboard.writeText(errorMessage);
    toast.error(errorMessage);
    return;
  }

  //STORE IN GLOBAL STATE
  setAccessRole(userAccessRoleFetchResponse.value.AccessRole);

  //NOT WAITING FOR THIS DATA
  fetchAndSetCurrentUserProperties();

  dataLoadState.setReady();
  return;
}

async function fetchAndSetCurrentUserProperties() {
  //FETCH USER PROPERTIES
  const provider = getDataProvider();
  const userPropertiesResponse = await provider.getCurrentUserProperties({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
  });

  if ("error" in userPropertiesResponse) {
    const errorMessage = "Something went wrong. Could not fetch user details. " + userPropertiesResponse.error;
    navigator.clipboard.writeText(errorMessage);
    toast.error(errorMessage);
    return;
  }

  //STORE IN GLOBAL STATE
  setUserProperties(userPropertiesResponse.value as Sharepoint_User_Properties);
}

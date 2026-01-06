import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { getCurrentUser } from "$lib/common-library/integrations/sharepoint-rest-api/get/getCurrentUser";
import { getCurrentUserProperties } from "$lib/common-library/integrations/sharepoint-rest-api/get/getCurrentUserProperties";
import { getListItems } from "$lib/common-library/integrations/sharepoint-rest-api/get/getListItems";
import { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "$lib/common-library/integrations/sharepoint-rest-api/local-data";
import { setCurrentUser, setAccessRole, setUserProperties } from "$lib/data/global-state.svelte";
import { LOCAL_USERS } from "$lib/data/local-data";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";

export async function getAndStoreCurrentUserInfo(dataLoadState: AsyncLoadState) {
  const fetchResponse = await getCurrentUser({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    dataToReturnInLocalMode: LOCAL_SHAREPOINT_USERS[0],
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

  const userAccessRoleFetchResponse = await getListItems({
    listName: SHAREPOINT_CONFIG.lists.UsersInfo.name,
    operations: [
      ["select", "User/Id,AccessRole"],
      ["expand", "User"],
      ["filter", `User/Id eq ${userId}`],
    ],
    dataToReturnInLocalMode: { value: LOCAL_USERS[0] },
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
  const userPropertiesResponse = await getCurrentUserProperties({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    dataToReturnInLocalMode: LOCAL_SHAREPOINT_USERS_PROPERTIES[0],
  });

  if ("error" in userPropertiesResponse) {
    const errorMessage = "Something went wrong. Could not fetch user details. " + userPropertiesResponse.error;
    navigator.clipboard.writeText(errorMessage);
    toast.error(errorMessage);
    return;
  }

  //STORE IN GLOBAL STATE
  setUserProperties(userPropertiesResponse);
}

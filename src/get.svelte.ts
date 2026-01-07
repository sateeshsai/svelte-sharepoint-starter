import type { AsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { setCurrentUser, setAccessRole, setUserProperties } from "$lib/data/global-state.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { Sharepoint_User_Properties } from "$lib/common-library/integrations/sharepoint-rest-api/data/types";
import type { User_ListItem } from "$lib/data/types";

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
  const currentUserId = fetchResponse.Id!;

  const userAccessRoleFetchResponse = await provider.getListItems<{ value: User_ListItem[] }>({
    listName: SHAREPOINT_CONFIG.lists.UsersInfo.name,
    operations: [
      ["select", "User/Id,AccessRole"],
      ["expand", "User"],
      ["filter", `User/Id eq ${currentUserId}`],
    ],
  });

  if ("error" in userAccessRoleFetchResponse) {
    const errorMessage = "Something went wrong. Could not verify user role. " + userAccessRoleFetchResponse.error;
    dataLoadState.setError(errorMessage);
    navigator.clipboard.writeText(errorMessage);
    toast.error(errorMessage);
    return;
  }

  const currentUserInDB = userAccessRoleFetchResponse.value[0];

  //STORE IN GLOBAL STATE
  if (currentUserInDB) {
    setAccessRole(currentUserInDB.AccessRole);
  }

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

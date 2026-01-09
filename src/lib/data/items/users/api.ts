/**
 * Users API - All user-related data operations
 */
import type { BaseAsyncLoadState } from "$lib/common-library/utils/async/async.svelte";
import { apiError } from "$lib/common-library/integrations";
import { getDataProvider } from "$lib/data/data-providers/provider-factory";
import { setCurrentUser, setAccessRole, setUserProperties } from "$lib/data/global-state.svelte";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { toast } from "svelte-sonner";
import type { Sharepoint_User_Properties } from "$lib/common-library/integrations/sharepoint-rest-api/data/types";
import type { User_ListItem } from "./schemas";

// ============================================================================
// GET Operations
// ============================================================================

export async function getAndStoreCurrentUserInfo(dataLoadState: BaseAsyncLoadState) {
  const provider = getDataProvider();

  const fetchResponse = await provider.getCurrentUser({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    logToConsole: false,
  });

  if ("error" in fetchResponse) {
    dataLoadState.setError(apiError({ userMessage: "Could not fetch user details", technicalMessage: fetchResponse.error, context: "Loading user info" }));
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
    const errorMessage = "Could not verify user role: " + userAccessRoleFetchResponse.error;
    dataLoadState.setError(apiError({ userMessage: "Could not verify user role", technicalMessage: userAccessRoleFetchResponse.error, context: "Verifying user role" }));
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

/**
 * Fetch user properties by SharePoint user ID
 * First gets the user to retrieve LoginName, then fetches their profile properties
 * @param userId - SharePoint user ID
 * @returns User properties or undefined if not found
 */
export async function getUserPropertiesById(userId: number): Promise<Sharepoint_User_Properties | undefined> {
  const provider = getDataProvider();

  // First get the user by ID to get their LoginName
  const userResponse = await provider.getUser({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    userId: String(userId),
  });

  if ("error" in userResponse) return undefined;

  // Then use the LoginName to fetch user properties
  const propsResponse = await provider.getUserProperties({
    siteCollectionUrl: SHAREPOINT_CONFIG.paths.site_collection,
    accountName: userResponse.LoginName,
  });

  if ("error" in propsResponse) return undefined;

  return propsResponse;
}

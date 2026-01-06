import type { AccessRole, Sharepoint_User, Sharepoint_User_Properties } from "$lib/common-library/integrations/sharepoint-rest-api/types";

export const global_State: { user: undefined | Sharepoint_User; AccessRole: AccessRole; userProperties: undefined | Sharepoint_User_Properties } = $state({
  user: undefined,
  userProperties: undefined,
  AccessRole: null,
});

/**
 * Set current user in global state
 * Validates that user data is valid before setting
 */
export function setCurrentUser(user: Sharepoint_User | undefined): void {
  if (user !== undefined && (!user.Id || !user.LoginName)) {
    console.warn("[Global State] Attempted to set invalid user data:", user);
    return;
  }
  global_State.user = user;
}

/**
 * Set user access role in global state
 * Validates that role is a valid AccessRole type
 */
export function setAccessRole(role: AccessRole): void {
  if (!role) {
    console.warn("[Global State] Attempted to set invalid access role:", role);
    return;
  }
  global_State.AccessRole = role;
}

/**
 * Set user properties in global state
 * Validates that properties are valid before setting
 */
export function setUserProperties(properties: Sharepoint_User_Properties | undefined): void {
  if (properties !== undefined && !properties.AccountName) {
    console.warn("[Global State] Attempted to set invalid user properties:", properties);
    return;
  }
  global_State.userProperties = properties;
}

/**
 * Reset all global state (for logout or cleanup)
 */
export function resetGlobalState(): void {
  global_State.user = undefined;
  global_State.AccessRole = null;
  global_State.userProperties = undefined;
}

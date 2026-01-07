import type { AccessRole, Sharepoint_User, Sharepoint_User_Properties } from "$lib/common-library/integrations/sharepoint-rest-api/data/types";

export const global_State: { currentUser: undefined | Sharepoint_User; accessRole: AccessRole; userProperties: undefined | Sharepoint_User_Properties } = $state({
  currentUser: undefined,
  userProperties: undefined,
  accessRole: null,
});

/**
 * Set current user - validates data before setting
 */
export function setCurrentUser(user: Sharepoint_User | undefined): void {
  if (user !== undefined && (!user.Id || !user.LoginName)) {
    console.warn("[Global State] Attempted to set invalid user data:", user);
    return;
  }
  global_State.currentUser = user;
}

/**
 * Set user access role - null is valid for non-admin users
 */
export function setAccessRole(role: AccessRole): void {
  global_State.accessRole = role;
}

/**
 * Set user properties - validates data before setting
 */
export function setUserProperties(properties: Sharepoint_User_Properties | undefined): void {
  if (properties !== undefined && !properties.AccountName) {
    console.warn("[Global State] Attempted to set invalid user properties:", properties);
    return;
  }
  global_State.userProperties = properties;
}

/** Reset all global state (for logout or cleanup) */
export function resetGlobalState(): void {
  global_State.currentUser = undefined;
  global_State.accessRole = null;
  global_State.userProperties = undefined;
}

/** Computed getter - true if current user is an admin */
export const isAdmin = $derived(global_State.accessRole === "Admin");

/** Computed getter - current user's ID (undefined if not logged in) */
export const currentUserId = $derived(global_State.currentUser?.Id);

/** Computed getter - true if user is logged in */
export const isLoggedIn = $derived(global_State.currentUser !== undefined);

/**
 * Check if current user can edit an item
 * Admins can edit anything, regular users can only edit their own items
 */
export function canEditItem(authorId: number | undefined): boolean {
  if (!authorId) return false;
  return global_State.accessRole === "Admin" || global_State.currentUser?.Id === authorId;
}

import type { AccessRole, Sharepoint_User, Sharepoint_User_Properties } from "$lib/common-library/sharepoint-rest-api/types";

export const global_State: { user: undefined | Sharepoint_User; AccessRole: AccessRole; userProperties: undefined | Sharepoint_User_Properties } = $state({
  user: undefined,
  userProperties: undefined,
  AccessRole: null,
});

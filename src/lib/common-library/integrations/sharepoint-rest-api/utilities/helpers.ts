import type { Sharepoint_User, Sharepoint_User_Properties, Sharepoint_Lookup_DefaultProps } from "../data/types";

/**
 * Generate $select and $expand OData parameters from object structure
 * Detects lookup fields (objects) and adds appropriate expand clauses
 * Field names truncated to 32 chars (SharePoint internal name limit)
 */
export function createSelectExpandQueries(obj: Record<string, any>) {
  if (typeof obj === "function") {
    obj = obj();
  }
  const selectKeys: string[] = [];
  const expandKeys: string[] = [];
  Object.entries(obj).forEach(([key_, value]) => {
    const key = key_.substring(0, 32);
    if (value && typeof value === "object") {
      selectKeys.push(key + "/Id" + "," + key + "/Title");
      expandKeys.push(key);
    } else {
      selectKeys.push(key);
    }
  });

  return {
    select: selectKeys.join(","),
    expand: expandKeys.join(","),
  };
}

/** Get profile picture URL from Deloitte's internal API */
export function getPictureUrl(emailAdress: string) {
  return `https://horizonbolt.deloitte.com/api/empdetails?profilepic&emailId=${emailAdress}`;
}

/** Extract first and last name from SharePoint user profile properties */
export function getUserFirstLastNames(user: Sharepoint_User_Properties): { first: string; last: string } {
  const firstName = user.UserProfileProperties.find((p) => p.Key === "FirstName");
  const lastName = user.UserProfileProperties.find((p) => p.Key === "LastName");
  return {
    first: firstName?.Value ?? "",
    last: lastName?.Value ?? "",
  };
}

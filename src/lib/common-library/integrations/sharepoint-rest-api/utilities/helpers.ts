import type { Sharepoint_User, Sharepoint_User_Properties, Sharepoint_Lookup_DefaultProps } from "../data/types";

/**
 * Generate $select and $expand OData query parameters from an object structure
 * Automatically detects lookup fields (objects) and creates proper expand clauses
 *
 * This is critical for SharePoint REST API queries with LookUp columns:
 * - Simple fields are added to $select
 * - Object fields (LookUp columns) are expanded with /Id and /Title
 * - Field names are truncated to 32 chars (SharePoint internal name limit)
 *
 * @param obj - Object representing the schema structure (typically from schemas.ts)
 * @returns Object with select and expand query strings
 * @example
 * const queries = createSelectExpandQueries({
 *   Title: "",
 *   Author: { Id: 0, Title: "" }, // LookUp field
 *   Content: ""
 * });
 * // Returns: { select: "Title,Author/Id,Author/Title,Content", expand: "Author" }
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

/**
 * Get user profile picture URL from 's internal API
 * @param emailAdress - User's email address
 * @returns URL to profile picture
 * @example getPictureUrl("jdoe@yourdomain.com")
 */
export function getPictureUrl(emailAdress: string) {
  // Add your API URL here
  return `https://www.<yourpictureapi>.com?email=${emailAdress}`;
}

/**
 * Extract first and last name from SharePoint user profile properties
 * SharePoint stores user properties as key-value pairs in UserProfileProperties array
 * @param user - SharePoint user properties object
 * @returns Object with first and last name (empty strings if not found)
 * @example
 * const names = getUserFirstLastNames(userProperties);
 * console.log(`${names.first} ${names.last}`); // "John Doe"
 */
export function getUserFirstLastNames(user: Sharepoint_User_Properties): { first: string; last: string } {
  const firstName = user.UserProfileProperties.find((p) => p.Key === "FirstName");
  const lastName = user.UserProfileProperties.find((p) => p.Key === "LastName");
  return {
    first: firstName?.Value ?? "",
    last: lastName?.Value ?? "",
  };
}

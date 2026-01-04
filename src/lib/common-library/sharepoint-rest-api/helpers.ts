import type { Sharepoint_User, Sharepoint_User_Properties, Sharepoint_Lookup_DefaultProps } from "./types";

export function createSelectExapandQueries(obj: Record<string, any>) {
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

export function getPictureUrl(emailAdress: string) {
  return `https://horizonbolt.deloitte.com/api/empdetails?profilepic&emailId=${emailAdress}`;
}

export function getUserFirstLastNames(user: Sharepoint_User_Properties): { first: string; last: string } {
  const firstName = user.UserProfileProperties.find((p) => p.Key === "FirstName");
  const lastName = user.UserProfileProperties.find((p) => p.Key === "LastName");
  return {
    first: firstName?.Value ?? "",
    last: lastName?.Value ?? "",
  };
}

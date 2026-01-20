import { RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "../../constants/const";
import { deduplicate } from "../helpers/deduplication";
import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_User_Properties } from "../../data/types";

/**
 * Constructs a SharePoint logonName from an email address or emailId
 * Format: "i:0ǵ.t|adfs prod|{username}"
 * @param emailOrLogonName - Email (user@domain.com), emailId (user), or full logonName
 * @returns Properly formatted logonName for SharePoint
 */
function toLogonName(emailOrLogonName: string): string {
  // If already a full logonName (contains the adfs pattern), return as-is
  if (emailOrLogonName.includes("|adfs prod|")) {
    return emailOrLogonName;
  }

  // Extract username from email or use as-is if just the username
  const username = emailOrLogonName.includes("@") ? emailOrLogonName.split("@")[0] : emailOrLogonName;

  return `i:0ǵ.t|adfs prod|${username.toLowerCase()}`;
}

/**
 * Get user profile properties for a specific user by logonName or emailId
 * Uses PeopleManager GetPropertiesFor endpoint
 *
 * @example
 * // By email
 * getSharepointUserProperties({ siteCollectionUrl, accountName: "sateesh.modukuru@yourdomain.com" })
 *
 * // By emailId (username portion)
 * getSharepointUserProperties({ siteCollectionUrl, accountName: "smodukuru" })
 *
 * // By full logonName
 * getSharepointUserProperties({ siteCollectionUrl, accountName: "i:0ǵ.t|adfs prod|smodukuru" })
 */
export function getSharepointUserProperties<T extends Sharepoint_User_Properties>(options: {
  siteCollectionUrl: string;
  /** Email address (user@domain.com), emailId (username), or full logonName */
  accountName: string;
  logToConsole?: boolean;
  signal?: AbortSignal;
  deduplicationTtlMs?: number;
}): Promise<T | Sharepoint_Error_Formatted> {
  const logonName = toLogonName(options.accountName);
  const encodedLogonName = encodeURIComponent(logonName);
  const requestURL = `${options.siteCollectionUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='${encodedLogonName}'`;

  if (options.logToConsole) console.log(requestURL);

  const fetchRequest = new Request(requestURL, {
    method: "GET",
    mode: "no-cors",
    credentials: "same-origin",
    headers: new Headers({
      Accept: "application/json;odata=nometadata",
      useCredentials: "true",
    }),
  });

  return deduplicate(
    requestURL,
    () =>
      fetch(fetchRequest, { signal: options.signal })
        .then((response) => response.json())
        .then((data: T | Sharepoint_Error | undefined) => {
          if (options.logToConsole) console.log("FN: getSharepointUserProperties Response", data);
          if (!data || "odata.error" in data) {
            return {
              error: "Unable to fetch user properties. Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. ") + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return data;
        })
        .catch((error) => {
          if (options.logToConsole) console.log("FN: getSharepointUserProperties Error", error);
          if (error instanceof Error && error.name === "AbortError") {
            return {
              error: "Unable to fetch user properties. Request timed out or was cancelled. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
            };
          }
          return {
            error: "Unable to fetch user properties. Network error occurred. " + RECOMMENDED_ERROR_ACTIONS_FOR_UI.reload,
          };
        }),
    {
      ttlMs: options.deduplicationTtlMs ?? 60000, // 60 second default TTL for user properties
      clearOnError: true,
    },
  );
}

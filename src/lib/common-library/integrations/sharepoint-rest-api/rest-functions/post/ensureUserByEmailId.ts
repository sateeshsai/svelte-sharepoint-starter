import type { Sharepoint_Error, Sharepoint_Error_Formatted, Sharepoint_User } from "../../data";
import { getFormDigestValue } from "../get/getFormDigestValue";

/**
 * Ensure a user exists in the SharePoint site by their email address
 * Creates the user if they don't exist, returns user info if they do
 *
 * @example
 * ensureUserByEmailId({ siteCollectionUrl, emailId: "user@domain.com" })
 * ensureUserByEmailId({ siteCollectionUrl, emailId: "username" })
 */
export async function ensureUserByEmailId(options: {
  siteCollectionUrl: string;
  emailId: string;
  formDigest?: string;
  logToConsole?: boolean;
  signal?: AbortSignal;
}): Promise<Sharepoint_User | Sharepoint_Error_Formatted> {
  // Extract username from email if full email provided
  const emailForLogonName = options.emailId.includes("@") ? options.emailId.split("@")[0] : options.emailId;

  if (options.logToConsole) console.log({ emailForLogonName });

  // Get form digest if not provided
  const formDigest = options.formDigest ?? ((await getFormDigestValue({ siteCollectionUrl: options.siteCollectionUrl })) as string);

  const request = new Request(`${options.siteCollectionUrl}/_api/web/ensureuser`, {
    method: "POST",
    credentials: "same-origin",
    headers: new Headers({
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json; odata=nometadata",
      "X-RequestDigest": formDigest,
      "IF-MATCH": "*",
    }),
    body: JSON.stringify({
      logonName: `i:0ǵ.t|adfs prod|${emailForLogonName.toLowerCase()}`,
    }),
  });

  return fetch(request, { signal: options.signal ?? null })
    .then((response) => response.json())
    .then((data: Sharepoint_User | Sharepoint_Error | undefined) => {
      if (options.logToConsole) console.log("FN: ensureUserByEmailId Response", data);
      if (!data || "odata.error" in data) {
        return {
          error: "Error message: " + (data?.["odata.error"].message.value ?? "Something went wrong. "),
        };
      }
      return data;
    })
    .catch((error) => {
      if (options.logToConsole) console.log("FN: ensureUserByEmailId Error", error);
      if (error instanceof Error && error.name === "AbortError") {
        return {
          error: "Request timed out or was cancelled. ",
        };
      }
      return {
        error: "Network error occurred. ",
      };
    });
}

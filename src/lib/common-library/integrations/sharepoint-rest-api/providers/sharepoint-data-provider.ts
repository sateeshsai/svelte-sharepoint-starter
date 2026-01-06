import type { DataProvider } from "./data-provider";
import type { SharePointConfig } from "../config";
import { getListItems as getListItemsAPI } from "../rest-functions/get/getListItems";
import { getCurrentUser as getCurrentUserAPI } from "../rest-functions/get/getCurrentUser";
import { getCurrentUserProperties as getCurrentUserPropertiesAPI } from "../rest-functions/get/getCurrentUserProperties";
import { getFormDigestValue as getFormDigestValueAPI } from "../rest-functions/get/getFormDigestValue";
import { postListItem as postListItemAPI } from "../rest-functions/post/postListItem";
import { readAndUploadFile as readAndUploadFileAPI } from "../rest-functions/post/readAndUploadFile";
import { updateListItem as updateListItemAPI } from "../rest-functions/update/updateListItem";
import { deleteListItem as deleteListItemAPI } from "../rest-functions/delete/deleteListItem";
import type { Sharepoint_Error_Formatted, Sharepoint_Get_Operations, Sharepoint_User } from "../data/types";

/**
 * SharePointDataProvider - implements DataProvider interface using real SharePoint REST API
 * Makes actual HTTP requests to SharePoint lists and operations
 * Config is injected via constructor for use as defaults in all methods
 */
export class SharePointDataProvider implements DataProvider {
  protected config: SharePointConfig;

  constructor(config: SharePointConfig) {
    this.config = config;
  }

  async getListItems<T extends { value: Record<string, any> }>(options: {
    siteCollectionUrl?: string;
    listName: string;
    operations?: Sharepoint_Get_Operations;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted> {
    return getListItemsAPI(options);
  }

  async getCurrentUser<T extends Sharepoint_User>(options: {
    siteCollectionUrl?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted> {
    return getCurrentUserAPI(options);
  }

  async getCurrentUserProperties(options: {
    siteCollectionUrl?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<{ value: Record<string, any> } | Sharepoint_Error_Formatted> {
    const result = await getCurrentUserPropertiesAPI(options);
    if ("error" in result) {
      return result;
    }
    return { value: result as Record<string, any> };
  }

  async getFormDigestValue(options: { siteCollectionUrl?: string; logToConsole?: boolean; signal?: AbortSignal }): Promise<string | Sharepoint_Error_Formatted> {
    return getFormDigestValueAPI(options);
  }

  async postListItem<T extends { d: Record<string, any> }>(options: {
    siteCollectionUrl?: string;
    listName: string;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<T | Sharepoint_Error_Formatted> {
    return postListItemAPI({
      siteCollectionUrl: options.siteCollectionUrl,
      listName: options.listName,
      dataToPost: options.body,
      logToConsole: options.logToConsole,
      signal: options.signal,
    }) as Promise<T | Sharepoint_Error_Formatted>;
  }

  async readAndUploadFile(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    file: File;
    folder?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<{ Url: string } | Sharepoint_Error_Formatted> {
    return readAndUploadFileAPI({
      siteCollectionUrl: options.siteCollectionUrl,
      serverRelativeUrl: "",
      foldername: options.folder || "Shared Documents",
      logToConsole: options.logToConsole,
      file: {
        name: options.file.name,
        obj: options.file,
      },
    }) as Promise<{ Url: string } | Sharepoint_Error_Formatted>;
  }

  async updateListItem(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<void | Sharepoint_Error_Formatted> {
    const result = await updateListItemAPI({
      siteCollectionUrl: options.siteCollectionUrl,
      listName: options.listName,
      itemId: options.itemId,
      dataToUpdate: options.body,
      logToConsole: options.logToConsole,
    });
    return result as void | Sharepoint_Error_Formatted;
  }

  async deleteListItem(options: { siteCollectionUrl?: string; listName: string; itemId: number; logToConsole?: boolean; signal?: AbortSignal }): Promise<void | Sharepoint_Error_Formatted> {
    const result = await deleteListItemAPI({
      siteCollectionUrl: options.siteCollectionUrl || "",
      listName: options.listName,
      itemId: options.itemId,
      logToConsole: options.logToConsole,
    });
    return result as void | Sharepoint_Error_Formatted;
  }
}

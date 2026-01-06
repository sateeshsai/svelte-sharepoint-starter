import { z } from "zod";

/**
 * Zod validation schema for SharePoint configuration
 * Ensures config has required fields and correct types at runtime
 * Catches typos and missing config early with descriptive errors
 */
export const SharePointConfigSchema = z
  .object({
    info: z.object({
      version: z.string().min(1, "Version required"),
      emails: z.object({
        support: z.object({
          email: z.string().email("Invalid support email"),
          subject: z.string().min(1, "Support subject required"),
          body: z.string().min(1, "Support body required"),
          cc: z.array(z.string()).default([]),
          bcc: z.array(z.string()).default([]),
        }),
      }),
    }),
    lists: z.record(
      z.string(),
      z.object({
        name: z.string().min(1, "List name cannot be empty"),
        schemas: z.object({
          list: z.any(),
          post: z.any(),
        }),
      })
    ),
    paths: z.object({
      root: z.string().min(1, "Root path required"),
      assets: z.string().min(1, "Assets path required"),
      page: z.string().min(1, "Page path required"),
      domain: z.string().min(1, "Domain required"),
      site_collection: z.string().min(1, "Site collection required"),
    }),
    folders: z.record(
      z.string(),
      z.object({
        name: z.string().min(1, "Folder name cannot be empty"),
        rel_path: z.string().min(1, "Relative path cannot be empty"),
      })
    ),
    siteCollectionUrl: z.string().optional(),
  })
  .passthrough(); // Allow extra properties for flexibility

/**
 * SharePoint Configuration Type
 * Derived from schema for type-safety and consistency
 * Ensures config shape matches validation rules
 */
export type SharePointConfig = z.infer<typeof SharePointConfigSchema>;

/**
 * Validate SharePoint configuration
 * @param config - Configuration object to validate
 * @returns Validated configuration
 * @throws Error with detailed field validation errors
 */
export function validateSharePointConfig(config: unknown): SharePointConfig {
  try {
    return SharePointConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors into readable message
      const formattedErrors = error.issues
        .map((issue: z.ZodIssue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root";
          return `${path}: ${issue.message}`;
        })
        .join("\n");
      throw new Error(`Invalid SharePoint configuration:\n${formattedErrors}`);
    }
    throw error;
  }
}

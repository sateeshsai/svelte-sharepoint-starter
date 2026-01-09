/**
 * Error Reports Local Data - Mock data for LOCAL_MODE development
 */
import type { ErrorReport_ListItem } from "./error-types";

export const LOCAL_ERROR_REPORTS: ErrorReport_ListItem[] = [
  {
    Id: 1,
    Title: "Network Error - Story List",
    ErrorType: "Network",
    Context: "Fetching story list from SharePoint REST API",
    TechnicalMessage: "Failed to fetch: 500 Internal Server Error - SharePoint list 'Stories' temporarily unavailable",
    UserMessage: "Unable to load stories. Please try again in a few moments.",
    RouteUrl: "/stories",
    BrowserUserAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    Created: new Date("2024-11-20").toISOString(),
    Modified: new Date("2024-11-20").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
  },
  {
    Id: 2,
    Title: "Validation Error - Story Creation",
    ErrorType: "Validation",
    Context: "Creating new story with invalid data",
    TechnicalMessage: "Zod validation failed: Title must be at least 10 characters, received 5",
    UserMessage: "Please ensure the title is at least 10 characters long.",
    RouteUrl: "/admin/stories/new",
    BrowserUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    Created: new Date("2024-12-05").toISOString(),
    Modified: new Date("2024-12-05").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
  },
  {
    Id: 3,
    Title: "Authentication Error",
    ErrorType: "Auth",
    Context: "Attempting to access admin panel without proper permissions",
    TechnicalMessage: "User not authorized: AccessRole is null, expected 'Admin'",
    UserMessage: "You don't have permission to access this area. Please contact an administrator.",
    RouteUrl: "/admin",
    BrowserUserAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    Created: new Date("2024-12-28").toISOString(),
    Modified: new Date("2024-12-28").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
  },
  {
    Id: 4,
    Title: "Timeout Error - File Upload",
    ErrorType: "Network",
    Context: "Uploading large video file to SharePoint",
    TechnicalMessage: "Request timeout after 60000ms - File size: 150MB exceeded recommended limit",
    UserMessage: "Upload timed out. Please try a smaller file or check your connection.",
    RouteUrl: "/admin/stories/9/edit",
    BrowserUserAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    Created: new Date("2025-01-03").toISOString(),
    Modified: new Date("2025-01-03").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
  },
  {
    Id: 5,
    Title: "Client Error - Invalid Route",
    ErrorType: "Other",
    Context: "Navigation to non-existent story ID",
    TechnicalMessage: "Story with ID 9999 not found in database",
    UserMessage: "The story you're looking for doesn't exist or has been removed.",
    RouteUrl: "/stories/9999",
    BrowserUserAgent: "Mozilla/5.0 (iPad; CPU OS 14_7 like Mac OS X) AppleWebKit/605.1.15",
    Created: new Date("2025-01-06").toISOString(),
    Modified: new Date("2025-01-06").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
  },
];

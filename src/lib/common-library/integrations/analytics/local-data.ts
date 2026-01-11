/**
 * Analytics Local Data - Mock data for LOCAL_MODE development
 */
import type { AnalyticsEntry_ListItem } from "./types";

export const LOCAL_ANALYTICS: AnalyticsEntry_ListItem[] = [
  {
    Id: 1,
    Title: "Session 001",
    SessionId: "mock-session-001",
    Route: "/stories",
    Data: JSON.stringify({ action: "view", timestamp: Date.now(), device: "desktop" }),
    Created: new Date("2024-12-15").toISOString(),
    Modified: new Date("2024-12-15").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
  },
  {
    Id: 2,
    Title: "Session 002",
    SessionId: "mock-session-002",
    Route: "/stories/1",
    Data: JSON.stringify({ action: "view", storyId: 1, timestamp: Date.now(), device: "mobile" }),
    Created: new Date("2024-12-20").toISOString(),
    Modified: new Date("2024-12-20").toISOString(),
    Author: {
      Id: 2,
      Title: "Doe, John",
    },
  },
  {
    Id: 3,
    Title: "Session 003",
    SessionId: "mock-session-003",
    Route: "/admin",
    Data: JSON.stringify({ action: "view", timestamp: Date.now(), device: "tablet" }),
    Created: new Date("2025-01-05").toISOString(),
    Modified: new Date("2025-01-05").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
  },
  {
    Id: 4,
    Title: "Session 004",
    SessionId: "mock-session-004",
    Route: "/stories/7",
    Data: JSON.stringify({ action: "engagement", engagementType: "💡", timestamp: Date.now() }),
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 3,
      Title: "Simpson, Homer",
    },
  },
];

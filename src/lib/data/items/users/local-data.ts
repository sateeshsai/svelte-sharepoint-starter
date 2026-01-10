/**
 * User Local Data - Mock data for LOCAL_MODE development
 *
 * Mock Users (must match engagement local-data.ts):
 * - Id 1: "Patel, Priya" (Admin, current user in LOCAL_MODE)
 * - Id 2: "Johnson, Michael"
 * - Id 3: "Sharma, Anjali"
 * - Id 4: "Williams, Sarah"
 * - Id 5: "Reddy, Vikram"
 */
import type { User_ListItem } from "./schemas";

export const LOCAL_USERS: User_ListItem[] = [
  {
    Id: 1,
    Title: "Priya Patel",
    User: {
      Id: 1,
      Title: "Patel, Priya",
    },
    AccessRole: "Admin",
    Created: new Date("2023-01-15").toISOString(),
    Modified: new Date("2023-01-15").toISOString(),
  },
  {
    Id: 2,
    Title: "Michael Johnson",
    User: {
      Id: 2,
      Title: "Johnson, Michael",
    },
    AccessRole: null,
    Created: new Date("2023-02-20").toISOString(),
    Modified: new Date("2023-02-20").toISOString(),
  },
  {
    Id: 3,
    Title: "Anjali Sharma",
    User: {
      Id: 3,
      Title: "Sharma, Anjali",
    },
    AccessRole: null,
    Created: new Date("2023-03-10").toISOString(),
    Modified: new Date("2023-03-10").toISOString(),
  },
  {
    Id: 4,
    Title: "Sarah Williams",
    User: {
      Id: 4,
      Title: "Williams, Sarah",
    },
    AccessRole: null,
    Created: new Date("2023-04-05").toISOString(),
    Modified: new Date("2023-04-05").toISOString(),
  },
  {
    Id: 5,
    Title: "Vikram Reddy",
    User: {
      Id: 5,
      Title: "Reddy, Vikram",
    },
    AccessRole: null,
    Created: new Date("2023-05-12").toISOString(),
    Modified: new Date("2023-05-12").toISOString(),
  },
];

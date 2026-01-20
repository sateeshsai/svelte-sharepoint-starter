import { BaseMockDataProvider, type MockPollContext } from "$lib/common-library/integrations/sharepoint-rest-api/providers/base-mock-data-provider";
import { LOCAL_STORY_ITEMS } from "$lib/data/items/stories/local-data";
import { LOCAL_FILES } from "$lib/data/items/files/local-data";
import { LOCAL_USERS } from "$lib/data/items/users/local-data";
import { LOCAL_ENGAGEMENTS } from "$lib/common-library/integrations/components/engagements/local-data";
import { LOCAL_ANALYTICS } from "$lib/common-library/integrations/analytics/local-data";
import { LOCAL_ERROR_REPORTS } from "$lib/common-library/integrations/error-handling/local-data";
import { SHAREPOINT_CONFIG, type AppSharePointConfig } from "$lib/env/sharepoint-config";

/**
 * Type-safe mock data mapping
 * TypeScript enforces an entry for every list in SHAREPOINT_CONFIG
 * Adding a new list without mock data here will cause compile error
 */
type ListNames = AppSharePointConfig["lists"][keyof AppSharePointConfig["lists"]]["name"];
type MockDataMap = Record<ListNames, any[]>;

const MOCK_DATA_BY_LIST_NAME: MockDataMap = {
  [SHAREPOINT_CONFIG.lists.Story.name]: LOCAL_STORY_ITEMS,
  [SHAREPOINT_CONFIG.lists.Engagements.name]: LOCAL_ENGAGEMENTS,
  [SHAREPOINT_CONFIG.lists.StoryFiles.name]: LOCAL_FILES,
  [SHAREPOINT_CONFIG.lists.UsersInfo.name]: LOCAL_USERS,
  [SHAREPOINT_CONFIG.lists.Analytics.name]: LOCAL_ANALYTICS,
  [SHAREPOINT_CONFIG.lists.ErrorReports.name]: LOCAL_ERROR_REPORTS,
};

/** Mock authors for simulated poll items */
const MOCK_AUTHORS = [
  { Id: 1, Title: "Modukuru, Sateeshsai" },
  { Id: 2, Title: "Doe, John" },
  { Id: 3, Title: "Simpson, Homer" },
  { Id: 4, Title: "Test, User" },
];

/** Reaction emojis for engagement simulation */
const REACTION_EMOJIS = ["❤️", "🚀", "⭐", "👏", "💡", "🎉"];

/** Comments for engagement simulation */
const MOCK_COMMENTS = [
  "Great work on this!",
  "Very insightful content.",
  "I learned something new today.",
  "Thanks for sharing!",
  "This is really helpful.",
];

/**
 * App-specific mock data provider with type-safe list name mapping
 */
export class MockDataProvider extends BaseMockDataProvider {
  protected getDataForList(listName: string): any[] {
    return MOCK_DATA_BY_LIST_NAME[listName] ?? [];
  }

  /**
   * Generate mock items for polling simulation.
   * Provides domain-specific mock data for Story and Engagement lists.
   */
  protected generateMockPollItems(listName: string, entryNumber: number, context: MockPollContext): any[] {
    // Story list: simulate new stories during Created-based polling
    if (listName === SHAREPOINT_CONFIG.lists.Story.name && context.filterColumn === "Created") {
      return [
        {
          Title: `Live Update Story #${entryNumber}`,
          Introduction: `This story was dynamically created during polling to test live updates. Created at ${new Date().toLocaleTimeString()}`,
          Content: `<h2>Live Update Test</h2><p>This story appeared dynamically during polling at ${new Date().toLocaleTimeString()} to demonstrate the live update feature.</p>`,
          Author: MOCK_AUTHORS[0],
          Tags: "live,polling,test",
          CoverFileName: "1.avif",
          ActiveStatus: "Active",
          PublishStatus: "Published",
        },
      ];
    }

    // Engagements list: simulate new reactions/comments during Parent/Id-based polling
    if (listName === SHAREPOINT_CONFIG.lists.Engagements.name && context.filterColumn === "Parent/Id") {
      const parentId = typeof context.filterValue === "number" ? context.filterValue : 1;
      const randomAuthor = MOCK_AUTHORS[Math.floor(Math.random() * MOCK_AUTHORS.length)];
      const isReaction = Math.random() > 0.3; // 70% reactions, 30% comments

      if (isReaction) {
        const emoji = REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)];
        return [
          {
            Title: emoji,
            EngagementType: "Reaction",
            Content: null,
            Author: randomAuthor,
            Parent: { Id: parentId, Title: `Parent ${parentId}` },
            ParentType: "Story",
          },
        ];
      } else {
        const comment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
        return [
          {
            Title: "",
            EngagementType: "Comment",
            Content: comment,
            Author: randomAuthor,
            Parent: { Id: parentId, Title: `Parent ${parentId}` },
            ParentType: "Story",
          },
        ];
      }
    }

    return [];
  }
}

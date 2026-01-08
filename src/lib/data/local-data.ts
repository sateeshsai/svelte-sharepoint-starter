import type { Engagement_ListItem, File_ListItem, Story_ListItem, User_ListItem } from "$lib/data/types";
import type { z } from "zod";
import type { AnalyticsEntryListSchema } from "$lib/common-library/integrations/analytics/schemas";
import type { ErrorReportListSchema } from "$lib/common-library/integrations/error-handling/error-schemas";

export type Analytics_ListItem = z.infer<typeof AnalyticsEntryListSchema>;
export type ErrorReport_ListItem = z.infer<typeof ErrorReportListSchema>;

// Helper to create dates relative to now for realistic polling testing
const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const LOCAL_STORY_ITEMS: Story_ListItem[] = [
  {
    Id: 1,
    Title: "Beyond the Stars",
    Introduction: "A journey through cosmic wonder and discovery. From across the vast expanse of space, a signal reached Earth with a simple yet profound invitation.",
    Content:
      '<h1>Beyond the Stars</h1><p>On a night when the stars aligned in a way that happens once every thousand years, something extraordinary occurred.</p><h2>The Signal</h2><p>From across the vast expanse of space, a signal reached Earth. It wasn\'t an invasion or a warning—it was an invitation.</p><p>Scientists worked frantically to decode the message. When they finally succeeded, the words were simple yet profound:</p><blockquote>"We have been waiting for you. The universe is vast, but never lonely. Come join us among the stars."</blockquote><h2>The Decision</h2><p>Humanity faced a choice that would define its future. Would they answer the call? Would they leave the safety of their world and venture into the unknown?</p><img src="./assets/images/3.avif" alt="Space station orbiting Earth" /><h2>The Journey Begins</h2><p>A ship was built. The finest minds and bravest souls volunteered. As they lifted off from Earth\'s surface, watched by billions below, a new chapter in human history began.</p><p>The stars were no longer just distant points of light—they were destinations.</p><p>And somewhere in the cosmos, others waited patiently for new friends to arrive.</p>',
    Created: daysAgo(5),
    Modified: daysAgo(5),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Tags: "space,adventure,sci-fi,discovery",
    CoverFileName: "3.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 2,
    Title: "Whispers of the Forest",
    Introduction: "An enchanting tale from deep within ancient woods where sunlight barely penetrates the canopy.",
    Content:
      '<h1>Whispers of the Forest</h1><p>In the heart of an ancient forest, where sunlight barely penetrated the canopy, lived creatures that time had forgotten.</p><h2>The Guardian</h2><p>There was one creature in particular—a being of pure magic who had watched over this sacred place since the beginning of memory. It was neither beast nor spirit, but something in between.</p><h2>The Discovery</h2><p>One day, a lost traveler stumbled into this hidden realm. The guardian appeared before them, not to frighten, but to guide.</p><img src="./assets/images/2.avif" alt="Ancient forest trees" /><p>"You have entered a place where time moves differently," the guardian said. "Here, every tree has a story, every stream carries wisdom."</p><h3>What the Traveler Learned</h3><ul><li>The forest teaches patience</li><li>Silence holds more truth than words</li><li>Everything is connected in ways we cannot see</li></ul><p>The traveler spent what felt like hours—or perhaps years—in the forest, learning its ancient secrets. When they finally emerged, they returned to the outside world changed forever.</p><p>The forest continues to wait, whispering its secrets to those brave enough to listen.</p>',
    Created: new Date("2024-06-10").toISOString(),
    Modified: new Date("2024-06-12").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Tags: "magic,nature,forest,fantasy",
    CoverFileName: "2.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 3,
    Title: "The Mountain's Tale",
    Introduction: "A story about adventure in the high peaks where the air is thin and the world stretches endlessly below.",
    Content:
      '<h1>The Mountain\'s Tale</h1><p>High above the clouds, where the air is thin and the world stretches endlessly below, there stood an ancient mountain. For millennia, it had watched civilizations rise and fall, empires crumble and new ones emerge.</p><h2>The First Ascent</h2><p>It was a crisp morning when the first climbers arrived at the base of the mountain. Armed with nothing but determination and rope, they began their journey upward.</p><img src="./assets/images/1.avif" alt="Mountain peak at sunrise" /><p>The path was treacherous. Every step required careful planning, every handhold a test of strength and will. Yet something drove them forward—a desire to reach the summit, to touch the sky.</p><h2>The View from Above</h2><p>When they finally reached the top, tears streamed down their faces. Below them lay the entire world—forests stretching to the horizon, rivers like silver threads, towns scattered like children\'s toys.</p><blockquote>"In this moment," one of them whispered, "I understand what it means to truly see."</blockquote><p>The mountain had witnessed another chapter of human courage added to its eternal story.</p>',
    Created: daysAgo(6),
    Modified: daysAgo(6),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Tags: "adventure,nature,mountains,courage",
    CoverFileName: "1.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 4,
    Title: "Minimum Title",
    Introduction: "Testing minimum length requirements for UI validation and display across various screen sizes.",
    Content: "<h2>Short Story Test</h2><p>This is deliberately minimal content to test how the UI handles edge cases with very short stories.</p>",
    Created: daysAgo(3),
    Modified: daysAgo(3),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Tags: "test,minimal",
    CoverFileName: "4.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 5,
    Title: "A Draft Story That Is Currently Being Written and Edited",
    Introduction: "This story is still being written and hasn't been published yet. It tests the draft workflow and how unpublished content appears in admin interfaces.",
    Content: "<h1>Draft in Progress</h1><p>This content is incomplete. More paragraphs will be added.</p><h2>Placeholder Section</h2><p>To be written...</p>",
    Created: hoursAgo(24),
    Modified: hoursAgo(12),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Tags: "draft,work-in-progress",
    CoverFileName: "5.avif",
    ActiveStatus: "Active",
    PublishStatus: "Draft",
  },
  {
    Id: 6,
    Title: "Inactive Story for Testing",
    Introduction: "This story has been marked as inactive. Testing how the system handles inactive content that shouldn't appear in public views.",
    Content: "<h2>Old Content</h2><p>This story was popular once but has been archived. It should not appear in regular story lists.</p>",
    Created: daysAgo(100),
    Modified: daysAgo(100),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Tags: "archived,old",
    CoverFileName: "6.avif",
    ActiveStatus: "Inactive",
    PublishStatus: "Published",
  },
  {
    Id: 7,
    Title: "The Art of Digital Transformation in Modern Enterprises",
    Introduction:
      "An exploration of how technology reshapes business landscapes. This comprehensive guide examines the challenges, opportunities, and strategies for successful digital transformation initiatives.",
    Content:
      '<h1>The Art of Digital Transformation</h1><p>In today\'s rapidly evolving business environment, digital transformation has become not just an option, but a necessity for survival and growth.</p><h2>Understanding the Landscape</h2><p>Digital transformation encompasses far more than simply adopting new technologies. It represents a fundamental shift in how organizations operate, deliver value to customers, and compete in their markets.</p><img src="./assets/images/7.avif" alt="Digital transformation concept" /><h3>Key Components</h3><ul><li><strong>Technology Infrastructure:</strong> Cloud computing, APIs, microservices</li><li><strong>Data Strategy:</strong> Analytics, AI/ML integration, real-time insights</li><li><strong>Cultural Change:</strong> Agile methodologies, continuous learning, innovation mindset</li><li><strong>Customer Experience:</strong> Omnichannel engagement, personalization, self-service</li></ul><h2>The Journey</h2><p>Successful transformation requires careful planning, strong leadership, and commitment across all levels of the organization. It\'s not a destination but an ongoing journey of adaptation and improvement.</p><blockquote>"The companies that thrive in the digital age are those that view transformation not as a project with an endpoint, but as a continuous evolution of capabilities and mindset."</blockquote><h2>Overcoming Challenges</h2><p>Organizations often face resistance to change, legacy system constraints, skill gaps, and competing priorities. Addressing these challenges requires:</p><ol><li>Clear vision and communication from leadership</li><li>Investment in training and talent development</li><li>Incremental, measurable progress with quick wins</li><li>Strong partnerships with technology providers</li><li>Focus on business outcomes, not just technology adoption</li></ol><p>The path forward demands courage, creativity, and commitment. Those who embrace this journey position themselves for success in an increasingly digital future.</p>',
    Created: hoursAgo(48),
    Modified: hoursAgo(36),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Tags: "business,technology,digital-transformation,enterprise,strategy",
    CoverFileName: "7.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 8,
    Title: "Empty Tags Story",
    Introduction: "Testing how the application handles stories with no tags assigned. This is important for validating filtering and search functionality.",
    Content: "<h2>No Tags</h2><p>This story intentionally has an empty tag string to test edge cases in the tag filtering system.</p>",
    Created: daysAgo(2),
    Modified: daysAgo(2),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Tags: "",
    CoverFileName: "8.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 9,
    Title: "Rich Media Story with Multiple Images and Complex Formatting",
    Introduction:
      "A comprehensive test of rich text capabilities including multiple images, various heading levels, lists, blockquotes, and complex HTML structures to validate the editor and viewer.",
    Content:
      '<h1>Rich Media Showcase</h1><p>This story demonstrates the full capabilities of the rich text editor and how content renders across different devices and screen sizes.</p><h2>Visual Elements</h2><img src="./assets/images/9.avif" alt="First image" /><p>Images are crucial for storytelling. They break up text, provide visual interest, and can convey information that words alone cannot.</p><h3>Subsection Example</h3><p>Here we explore deeper into the topic with additional detail and supporting information.</p><img src="./assets/images/10.avif" alt="Second image" /><h2>Lists and Structure</h2><h3>Unordered List</h3><ul><li>First bullet point with important information</li><li>Second point explaining key concepts</li><li>Third point with additional context<ul><li>Nested bullet point</li><li>Another nested item</li></ul></li><li>Final top-level point</li></ul><h3>Ordered List</h3><ol><li>Step one in the process</li><li>Step two follows naturally</li><li>Step three completes the sequence</li></ol><img src="./assets/images/11.avif" alt="Third image" /><h2>Quotes and Emphasis</h2><blockquote>"Complex formatting tests the limits of our rendering engine and ensures we can handle real-world content creation needs."</blockquote><p><strong>Bold text</strong> and <em>italic text</em> help emphasize important points within paragraphs.</p><h2>Conclusion</h2><p>This comprehensive example ensures our system can handle varied, rich content that users might create in production environments.</p><img src="./assets/images/12.avif" alt="Final image" />',
    Created: hoursAgo(12),
    Modified: hoursAgo(8),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Tags: "test,rich-media,formatting,images,comprehensive",
    CoverFileName: "9.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 10,
    Title: "Very Recent Story",
    Introduction: "Published just moments ago to test sorting by date and ensuring the most recent content appears correctly in feeds and lists.",
    Content: "<h2>Fresh Content</h2><p>This story was created very recently and should appear at the top of date-sorted lists.</p>",
    Created: minutesAgo(5),
    Modified: minutesAgo(5),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Tags: "new,recent,test",
    CoverFileName: "10.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 11,
    Title: "Multiple Authors Test - Collaboration Story",
    Introduction: "Testing the display of stories with modification dates much newer than creation dates, simulating collaborative editing scenarios.",
    Content:
      "<h2>Collaborative Work</h2><p>This story was originally created months ago but has been recently edited by multiple team members.</p><p>The modification date should be significantly different from the creation date.</p>",
    Created: daysAgo(30),
    Modified: hoursAgo(2),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Tags: "collaboration,team,edited",
    CoverFileName: "11.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
  {
    Id: 12,
    Title: "Special Characters & Symbols Test: Unicode, Emojis 🚀, and More!",
    Introduction: "Testing how the system handles special characters, Unicode symbols, emojis 😊, punctuation marks, and other non-standard text that might cause encoding or display issues.",
    Content:
      '<h2>Special Characters Test</h2><p>This story contains various special characters: &amp; &lt; &gt; " \' to test HTML encoding.</p><h3>Unicode Symbols</h3><p>Mathematical symbols: ∑ ∏ ∫ ∂ √ ∞</p><p>Currency: $ € £ ¥ ₹</p><p>Arrows: → ← ↑ ↓ ⇒ ⇐</p><h3>Emojis</h3><p>😀 😃 😄 😁 🚀 🌟 ⭐ 💡 🎯 🏆 🎨 🎭 🎪</p><h3>Punctuation</h3><p>Em dash—en dash–ellipsis... quotes "smart" and \'other\' varieties.</p><blockquote>"Testing quotes with special chars: &lt;tag&gt; &amp; symbols!"</blockquote>',
    Created: hoursAgo(6),
    Modified: hoursAgo(4),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Tags: "unicode,special-chars,encoding,emoji,test",
    CoverFileName: "12.avif",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  },
];

export const LOCAL_ENGAGEMENTS: Engagement_ListItem[] = [
  // Story 1: Beyond the Stars - High engagement (reactions + comments)
  {
    Id: 1,
    Title: "❤️",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-03-16").toISOString(),
    Modified: new Date("2024-03-16").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
  },
  {
    Id: 2,
    Title: "🚀",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-03-17").toISOString(),
    Modified: new Date("2024-03-17").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
  },
  {
    Id: 3,
    Title: "⭐",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-03-18").toISOString(),
    Modified: new Date("2024-03-18").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
  },
  {
    Id: 4,
    Title: "❤️",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-03-19").toISOString(),
    Modified: new Date("2024-03-19").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
  },
  {
    Id: 16,
    Title: "This story beautifully captures the sense of wonder...",
    EngagementType: "Comment",
    Content: "This story beautifully captures the sense of wonder and adventure that comes with space exploration. The invitation from beyond is such a powerful narrative device!",
    Created: new Date("2024-03-20").toISOString(),
    Modified: new Date("2024-03-20").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
  },
  // Story 2: Whispers of the Forest - Moderate engagement
  {
    Id: 5,
    Title: "🌲",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-06-11").toISOString(),
    Modified: new Date("2024-06-11").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
  },
  {
    Id: 6,
    Title: "💚",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-06-12").toISOString(),
    Modified: new Date("2024-06-12").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
  },
  {
    Id: 17,
    Title: "The forest setting is perfect for this kind of...",
    EngagementType: "Comment",
    Content: "The forest setting is perfect for this kind of magical realism. I love how you've woven ancient wisdom into the narrative. Really resonates with themes of mindfulness.",
    Created: new Date("2024-06-13").toISOString(),
    Modified: new Date("2024-06-13").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
  },
  // Story 3: The Mountain's Tale - Low engagement
  {
    Id: 7,
    Title: "⛰️",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-01-11").toISOString(),
    Modified: new Date("2024-01-11").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 3, Title: "The Mountain's Tale" },
    ParentType: "Story",
  },
  // Story 4: Minimum Title - No engagements (testing zero engagement)

  // Story 5: Draft Story - No engagements (draft shouldn't have public engagement)

  // Story 6: Inactive Story - Old engagements
  {
    Id: 8,
    Title: "👍",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2022-05-16").toISOString(),
    Modified: new Date("2022-05-16").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 6, Title: "Inactive Story for Testing" },
    ParentType: "Story",
  },
  // Story 7: Digital Transformation - High engagement
  {
    Id: 9,
    Title: "💡",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-09-21").toISOString(),
    Modified: new Date("2024-09-21").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
  },
  {
    Id: 10,
    Title: "🎯",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-09-25").toISOString(),
    Modified: new Date("2024-09-25").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
  },
  {
    Id: 11,
    Title: "❤️",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-10-01").toISOString(),
    Modified: new Date("2024-10-01").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
  },
  {
    Id: 18,
    Title: "Excellent breakdown of digital transformation...",
    EngagementType: "Comment",
    Content:
      "Excellent breakdown of digital transformation challenges. The emphasis on cultural change alongside technology is spot on. We've seen similar patterns in our own transformation journey.",
    Created: new Date("2024-10-02").toISOString(),
    Modified: new Date("2024-10-02").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
  },
  {
    Id: 19,
    Title: "The key components section is particularly usefu...",
    EngagementType: "Comment",
    Content:
      "The key components section is particularly useful. Would love to see a follow-up article diving deeper into the data strategy aspect - that's where many organizations struggle the most.",
    Created: new Date("2024-10-05").toISOString(),
    Modified: new Date("2024-10-05").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
  },
  // Story 8: Empty Tags - No engagements

  // Story 9: Rich Media - Multiple engagements
  {
    Id: 12,
    Title: "🎨",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-08-11").toISOString(),
    Modified: new Date("2024-08-11").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
  },
  {
    Id: 13,
    Title: "❤️",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-08-20").toISOString(),
    Modified: new Date("2024-08-20").toISOString(),
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
  },
  // Story 10: Very Recent - One recent engagement
  {
    Id: 14,
    Title: "✨",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 10, Title: "Very Recent Story" },
    ParentType: "Story",
  },
  // Story 11: Collaboration - No engagements

  // Story 12: Special Characters - Testing emoji engagement
  {
    Id: 15,
    Title: "😀",
    EngagementType: "Reaction",
    Content: null,
    Created: new Date("2024-07-21").toISOString(),
    Modified: new Date("2024-07-21").toISOString(),
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 12, Title: "Special Characters & Symbols Test: Unicode, Emojis 🚀, and More!" },
    ParentType: "Story",
  },
  {
    Id: 20,
    Title: "Great test case for Unicode handling! The emojis...",
    EngagementType: "Comment",
    Content: "Great test case for Unicode handling! The emojis and special characters all render perfectly. This is crucial for international audiences and diverse content.",
    Created: new Date("2024-07-22").toISOString(),
    Modified: new Date("2024-07-22").toISOString(),
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 12, Title: "Special Characters & Symbols Test: Unicode, Emojis 🚀, and More!" },
    ParentType: "Story",
  },
];

export const LOCAL_FILES: File_ListItem[] = [
  // Story 1: Beyond the Stars - Multiple files with varied types
  {
    Id: 1,
    Title: "1.avif",
    Created: new Date("2024-03-15").toISOString(),
    Modified: new Date("2024-03-15").toISOString(),
    Description: "The orbiting space station above Earth",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 2,
    Title: "2.avif",
    Created: new Date("2024-03-15").toISOString(),
    Modified: new Date("2024-03-15").toISOString(),
    Description: "A stunning view of distant galaxies",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 3,
    Title: "space-mission.mp4",
    Created: new Date("2024-03-15").toISOString(),
    Modified: new Date("2024-03-15").toISOString(),
    Description: "Video documentation of the mission launch",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 1, Title: "Beyond the Stars" },
    ParentType: "Story",
    FileOrder: 3,
  },
  // Story 2: Whispers of the Forest - Nature images
  {
    Id: 4,
    Title: "3.avif",
    Created: new Date("2024-06-10").toISOString(),
    Modified: new Date("2024-06-10").toISOString(),
    Description: "Towering trees in the heart of the forest",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 5,
    Title: "4.avif",
    Created: new Date("2024-06-10").toISOString(),
    Modified: new Date("2024-06-10").toISOString(),
    Description: "A peaceful stream flowing through the woods",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 2, Title: "Whispers of the Forest" },
    ParentType: "Story",
    FileOrder: 2,
  },
  // Story 3: The Mountain's Tale - Mountain images
  {
    Id: 6,
    Title: "5.avif",
    Created: new Date("2023-12-05").toISOString(),
    Modified: new Date("2023-12-05").toISOString(),
    Description: "The summit view at sunrise",
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 3, Title: "The Mountain's Tale" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 7,
    Title: "6.avif",
    Created: new Date("2023-12-05").toISOString(),
    Modified: new Date("2023-12-05").toISOString(),
    Description: "The vast valley stretching to the horizon",
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 3, Title: "The Mountain's Tale" },
    ParentType: "Story",
    FileOrder: 2,
  },
  // Story 4: Minimum Title - Single file (testing minimum)
  {
    Id: 8,
    Title: "4.avif",
    Created: new Date("2025-01-01").toISOString(),
    Modified: new Date("2025-01-01").toISOString(),
    Description: "Single supporting image for minimal story",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 4, Title: "Minimum Title" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 5: Draft Story - Files being prepared
  {
    Id: 9,
    Title: "5.avif",
    Created: new Date("2025-01-05").toISOString(),
    Modified: new Date("2025-01-06").toISOString(),
    Description: "Work in progress image",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 5, Title: "A Draft Story That Is Currently Being Written and Edited" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 6: Inactive Story - No files (testing zero files case)

  // Story 7: Digital Transformation - Multiple professional documents
  {
    Id: 10,
    Title: "7.avif",
    Created: new Date("2024-09-20").toISOString(),
    Modified: new Date("2024-09-20").toISOString(),
    Description: "Digital transformation framework diagram",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 11,
    Title: "transformation-case-study.pdf",
    Created: new Date("2024-09-20").toISOString(),
    Modified: new Date("2024-09-20").toISOString(),
    Description: "Detailed case study with implementation strategies and ROI analysis",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 12,
    Title: "enterprise-architecture.png",
    Created: new Date("2024-09-20").toISOString(),
    Modified: new Date("2024-09-20").toISOString(),
    Description: "Reference architecture for modern digital enterprises",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 7, Title: "The Art of Digital Transformation in Modern Enterprises" },
    ParentType: "Story",
    FileOrder: 3,
  },
  // Story 8: Empty Tags - Single file
  {
    Id: 13,
    Title: "8.avif",
    Created: new Date("2024-11-15").toISOString(),
    Modified: new Date("2024-11-15").toISOString(),
    Description: "Generic supporting image",
    Author: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    Parent: { Id: 8, Title: "Empty Tags Story" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 9: Rich Media - Many files with varied captions (testing maximum)
  {
    Id: 14,
    Title: "9.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "First showcase image demonstrating high-resolution rendering",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 1,
  },
  {
    Id: 15,
    Title: "10.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Second image with medium-length caption for testing text wrapping and layout",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 2,
  },
  {
    Id: 16,
    Title: "11.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Short",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 3,
  },
  {
    Id: 17,
    Title: "12.avif",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description:
      "This is an extremely long caption designed to test how the UI handles captions that extend beyond typical lengths, including multiple sentences with detailed information about the image content, technical specifications, and contextual details that might be relevant to understanding the visual.",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 4,
  },
  {
    Id: 18,
    Title: "demo-video.mp4",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Video demonstration of rich media capabilities",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 5,
  },
  {
    Id: 19,
    Title: "audio-narration.mp3",
    Created: new Date("2024-08-10").toISOString(),
    Modified: new Date("2024-08-10").toISOString(),
    Description: "Audio narration track for accessibility",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 9, Title: "Rich Media Story with Multiple Images and Complex Formatting" },
    ParentType: "Story",
    FileOrder: 6,
  },
  // Story 10: Very Recent - Fresh files
  {
    Id: 20,
    Title: "10.avif",
    Created: new Date().toISOString(),
    Modified: new Date().toISOString(),
    Description: "Just uploaded image file",
    Author: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    Parent: { Id: 10, Title: "Very Recent Story" },
    ParentType: "Story",
    FileOrder: 1,
  },
  // Story 11: Collaboration - No files (testing another zero-file case)

  // Story 12: Special Characters - Testing special chars in filenames and descriptions
  {
    Id: 21,
    Title: "special-chars-&-symbols.avif",
    Created: new Date("2024-07-20").toISOString(),
    Modified: new Date("2024-07-20").toISOString(),
    Description: "Testing special chars: & < > \" ' and emojis 🚀 😊 in descriptions",
    Author: {
      Id: 2,
      Title: "Mooring, James",
    },
    Parent: { Id: 12, Title: "Special Characters & Symbols Test: Unicode, Emojis 🚀, and More!" },
    ParentType: "Story",
    FileOrder: 1,
  },
];

export const LOCAL_USERS: User_ListItem[] = [
  {
    Id: 1,
    Title: "Sateesh Modukuru",
    User: {
      Id: 1,
      Title: "Modukuru, Sateeshsai",
    },
    AccessRole: "Admin",
    Created: new Date("2023-01-15").toISOString(),
    Modified: new Date("2023-01-15").toISOString(),
  },
  {
    Id: 2,
    Title: "Jim Mooring",
    User: {
      Id: 2,
      Title: "Mooring, James",
    },
    AccessRole: null,
    Created: new Date("2023-02-20").toISOString(),
    Modified: new Date("2023-02-20").toISOString(),
  },
  {
    Id: 3,
    Title: "Tripti Gupta",
    User: {
      Id: 3,
      Title: "Gupta, Tripti",
    },
    AccessRole: null,
    Created: new Date("2023-03-10").toISOString(),
    Modified: new Date("2023-03-10").toISOString(),
  },
];

export const LOCAL_ANALYTICS: Analytics_ListItem[] = [
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
      Title: "Mooring, James",
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
      Title: "Gupta, Tripti",
    },
  },
];

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

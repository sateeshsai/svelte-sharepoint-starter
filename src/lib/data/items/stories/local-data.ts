/**
 * Story Local Data - Mock data for LOCAL_MODE development
 */
import type { Story_ListItem } from "./schemas";

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

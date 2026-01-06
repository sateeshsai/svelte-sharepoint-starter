import { getStories, type StoryMarkdown } from "../get-stories";

export async function getStory(slug: string): Promise<StoryMarkdown | null> {
  const stories = await getStories();
  return stories.find((s) => s.slug === slug) || null;
}

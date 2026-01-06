import type { Story_ListItem, File_ListItem } from "$lib/data/types";
import YAML from "js-yaml";
import { marked } from "marked";

export type StoryMarkdown = Story_ListItem & {
  slug: string;
  htmlContent: string;
  Files?: File_ListItem[];
};

async function extractFrontmatter(markdown: string): Promise<Record<string, any>> {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  try {
    return YAML.load(match[1]) as Record<string, any>;
  } catch (e) {
    console.error("Failed to parse frontmatter:", e);
    return {};
  }
}

function extractContent(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
}

export async function getStories(): Promise<StoryMarkdown[]> {
  try {
    // Fetch the stories index
    const indexResponse = await fetch("./assets/StoryFiles/markdown/stories.md");
    const indexContent = await indexResponse.text();

    // Parse story slugs from the index (each line starting with -)
    const slugs = indexContent
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter(Boolean);

    // Fetch each story
    const stories = await Promise.all(
      slugs.map(async (slug): Promise<StoryMarkdown> => {
        const response = await fetch(`./assets/StoryFiles/markdown/${slug}.md`);
        const markdown = await response.text();

        const metadata = await extractFrontmatter(markdown);
        const content = extractContent(markdown);
        const htmlContent = await marked(content);

        return {
          slug,
          htmlContent,
          Id: Math.random(),
          Title: metadata.Title || slug,
          Content: content,
          Tags: metadata.Tags || "",
          Introduction: metadata.Introduction || "",
          CoverFileName: metadata.CoverFileName || "",
          ActiveStatus: "Active" as const,
          PublishStatus: "Published" as const,
          Created: new Date().toISOString(),
          Modified: new Date().toISOString(),
          Author: { Id: 0, Title: "Markdown Author" },
          Engagements: [],
          Files: metadata.Files || [],
        };
      })
    );

    return stories;
  } catch (error) {
    console.error("Failed to load stories:", error);
    return [];
  }
}

export async function getStory(slug: string): Promise<StoryMarkdown | null> {
  const stories = await getStories();
  return stories.find((s) => s.slug === slug) || null;
}

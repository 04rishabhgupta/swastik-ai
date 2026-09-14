import fs from "fs/promises";
import path from "path";

/**
 * Reads the knowledge base markdown file and returns its content.
 * This function should only be called server-side.
 */
export async function getKnowledgeBase(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "data", "knowledge.md");
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Failed to read knowledge base:", error);
    throw new Error("Unable to load clinic information.");
  }
}

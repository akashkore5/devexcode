import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DataService } from "../../../lib/data-service";
import Learn10DetailClient from "./Learn10DetailClient";
import { notFound } from "next/navigation";

export default async function Learn10DetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const topic = await DataService.getLearn10TopicById(id);
  
  if (!topic) notFound();

  let content = "";
  let frontmatter = {};

  try {
    const sanitizeFilename = (filename: string) => {
      return filename.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    };

    // The legacy code looks for files like: learn10/001_what_is_kafka.md
    const paddedId = id.padStart(3, "0");
    const filename = `${paddedId}_${sanitizeFilename(topic.title)}.md`;
    
    // Check various possible locations
    const possiblePaths = [
      path.join(process.cwd(), "learn10", filename),
      path.join(process.cwd(), "src/posts/learn10", filename),
      path.join(process.cwd(), "src/posts", filename)
    ];

    let found = false;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const matterResult = matter(fileContent);
        frontmatter = matterResult.data;
        content = matterResult.content;
        found = true;
        break;
      }
    }

    if (!found) {
      // Fallback content if file doesn't exist
      content = `
# ${topic.title}

This 10-minute engineering brief is currently being optimized for high-density learning.

### In this brief:
- **Core Mechanism**: Understanding the "how" and "why" behind ${topic.title}.
- **Trade-offs**: Exploring performance, scalability, and complexity.
- **Implementation Strategy**: Best practices for real-world integration.
- **Key Takeaways**: The non-negotiable facts you need for your next interview.

> [!NOTE]
> Our engineering team is currently updating this module with the latest architectural blueprints and performance benchmarks. Check back soon for the full deep-dive.
`;
    }
  } catch (error) {
    console.warn(`Error reading markdown for learn10 topic ${id}:`, error);
    content = `# ${topic.title}\n\nTechnical brief not available yet. Our high-density learning modules are updated weekly.`;
  }

  return (
    <Learn10DetailClient 
      topic={topic}
      content={content}
      frontmatter={frontmatter}
    />
  );
}

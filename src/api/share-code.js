import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import NodeCache from "node-cache";
import gfgProblems from "../../data/gfgproblems.json";
import matter from "gray-matter";

// Register Fira Code font for code snippets
try {
  const firaCodePath = path.join(process.cwd(), "public", "fonts", "FiraCode-Regular.ttf");
  if (fs.existsSync(firaCodePath)) {
    registerFont(firaCodePath, { family: "Fira Code", weight: "400" });
    
  } else {
    console.warn("Fira Code font file not found; falling back to system monospace font");
  }
} catch (e) {
  console.error("Error registering Fira Code font:", e);
}

// Cache for favicon and content hash
let faviconCache = null;
let contentHashCache = null;

// Initialize cache (TTL: 1 hour = 3600 seconds)
const imageCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export default async function handler(req, res) {
  // Validate query parameters
  const { id, lang } = req.query;
  if (!id || !lang || !["java", "cpp", "python"].includes(lang)) {
    res.status(400).json({ message: "Invalid or missing id or lang parameter" });
    return;
  }

  // Find the problem
  const problem = gfgProblems.find((p) => p.id === parseInt(id, 10));
  if (!problem) {
    res.status(404).json({ message: "Problem not found" });
    return;
  }

  // Read the markdown file to get the code
  try {
    const filePath = path.join(process.cwd(), "gfgblogs", `${id}.md`);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Problem markdown file not found" });
      return;
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(fileContent);

    const regex = new RegExp(`\`\`\`${lang}\n([\\s\\S]*?)\n\`\`\``, "i");
    const match = content.match(regex);
    const code = match ? match[1].trim() : "";
    if (!code) {
      res.status(404).json({ message: `Code not found for language ${lang}` });
      return;
    }

    // Check content hash for cache invalidation
    const contentHash = crypto.createHash("sha256").update(fileContent).digest("hex");
    if (contentHashCache && contentHashCache !== contentHash) {
      imageCache.flushAll();
      
    }
    contentHashCache = contentHash;

    // Check cache for PNG
    const cacheKey = `share-code:${id}:${lang}:${contentHash}`;
    const cachedBuffer = imageCache.get(cacheKey);
    if (cachedBuffer) {
      
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.status(200).end(cachedBuffer);
      return;
    }

    // Layout constants
    const maxWidth = 1200;
    const minWidth = 800;
    const aspectRatio = 1.91;
    const headerHeight = 100;
    const footerHeight = 60;
    const codePadding = 20;
    const lineHeight = 30;
    const topPadding = 20;
    const bottomPadding = 40;
    const maxTextWidth = maxWidth - 120;

    // Calculate code lines
    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = "20px 'Fira Code', monospace";
    const codeLines = wrapText(tempCtx, code, maxTextWidth - codePadding * 2);
    const codeHeight = codeLines * lineHeight + codePadding * 2;

    // Determine width
    let width;
    if (codeLines <= 10) {
      width = 800;
    } else if (codeLines <= 20) {
      width = 1000;
    } else {
      width = 1200;
    }

    // Recalculate text width
    const textWidth = width - 120;
    const finalCodeLines = wrapText(tempCtx, code, textWidth - codePadding * 2);
    const finalCodeHeight = finalCodeLines * lineHeight + codePadding * 2;

    // Calculate height
    const contentHeight = headerHeight + finalCodeHeight + footerHeight + topPadding + bottomPadding;
    const minHeight = Math.ceil(width / aspectRatio);
    const height = Math.max(contentHeight, minHeight);

    // Create canvas with final dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background: Code editor-like gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1e293b"); // Dark slate (code editor background)
    gradient.addColorStop(1, "#0f172a"); // Darker slate
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative elements: Syntax highlighting colored dots
    const dotColors = ["#ff79c6", "#8be9fd", "#50fa7b", "#ffb86c"]; // Pink, Cyan, Green, Orange
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = dotColors[i % dotColors.length];
      ctx.beginPath();
      ctx.arc(30 + i * 20, 30, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Header: Problem title and language
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Fira Code', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleText = `${problem.id}. ${problem.title}`;
    let titleFontSize = 36;
    let titleMetrics = ctx.measureText(titleText);
    while (titleMetrics.width > textWidth && titleFontSize > 24) {
      titleFontSize -= 2;
      ctx.font = `bold ${titleFontSize}px 'Fira Code', monospace`;
      titleMetrics = ctx.measureText(titleText);
    }
    ctx.fillText(titleText, 60, 40);

    // Language label
    ctx.font = "bold 24px 'Fira Code', monospace";
    ctx.fillStyle = "#a5b4fc"; // Light purple for language
    ctx.textAlign = "right";
    ctx.fillText(lang.toUpperCase(), width - 60, 40);

    // Code block container (mimicking a code editor)
    const codeTop = headerHeight + topPadding;
    ctx.fillStyle = "#2d3748"; // Slightly lighter than background
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 2;
    roundRect(ctx, 60, codeTop, textWidth, finalCodeHeight, 10);
    ctx.fill();
    ctx.stroke();

    // Code text
    ctx.fillStyle = "#e5e7eb"; // Light gray for code text
    ctx.font = "20px 'Fira Code', monospace";
    ctx.textAlign = "left";
    wrapText(ctx, code, 60 + codePadding, codeTop + codePadding, textWidth - codePadding * 2, lineHeight);

    // Footer
    try {
      const logoSize = 40;
      const logoPadding = 20;
      const bottomY = codeTop + finalCodeHeight + 30 + (footerHeight / 2);
      let logo = faviconCache;

      if (!logo) {
        const faviconPath = path.join(process.cwd(), "public", "favicon.png");
        
        logo = await loadImage(faviconPath);
        faviconCache = logo;
      }

      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "#9ca3af";
      ctx.font = "18px 'Fira Code', monospace";
      ctx.fillText(`GFG Problem #${problem.id}`, 60, bottomY);

      const websiteText = "DevExCode.com";
      ctx.textAlign = "right";
      ctx.fillStyle = "#a5b4fc";
      ctx.font = "bold 24px 'Fira Code', monospace";
      const websiteTextWidth = ctx.measureText(websiteText).width;
      const logoX = width - logoPadding - logoSize;
      const textX = logoX - 10;
      ctx.drawImage(logo, logoX, bottomY - logoSize / 2, logoSize, logoSize);
      ctx.fillText(websiteText, textX, bottomY);
    } catch (e) {
      console.error("Footer rendering error:", e);
      const bottomY = codeTop + finalCodeHeight + 30 + (footerHeight / 2);
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "#9ca3af";
      ctx.font = "18px 'Fira Code', monospace";
      ctx.fillText(`GFG Problem #${problem.id}`, 60, bottomY);
      ctx.textAlign = "right";
      ctx.fillStyle = "#a5b4fc";
      ctx.font = "bold 24px 'Fira Code', monospace";
      ctx.fillText("DevExCode.com", width - 20, bottomY);
    }

    // Cache and send the image
    const buffer = canvas.toBuffer("image/png");
    imageCache.set(cacheKey, buffer);
    
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).end(buffer);
  } catch (error) {
    console.error("Error generating share image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Rounded rectangle helper
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

// Text wrap helper
function wrapText(ctx, text, x, maxWidth) {
  const lines = [];
  const words = text.split("\n");
  for (let line of words) {
    let currentLine = "";
    const segments = line.split(" ");
    for (let i = 0; i < segments.length; i++) {
      const testLine = currentLine + segments[i] + (i < segments.length - 1 ? " " : "");
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = segments[i] + " ";
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine.trim());
  }
  return lines;
}

// Draw text with wrapping
function drawText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapText(ctx, text, x, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
  return lines.length;
}